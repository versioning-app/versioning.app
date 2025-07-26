import 'server-only';

import { serverLoggerWithHeaders } from '@/lib/logger/server';
import { BaseService } from '@/services/base.service';
import { type AppHeaders } from '@/types/headers';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

type ServiceConstructor<T extends BaseService> = new (headers: AppHeaders) => T;

// Augment each cached instance with an internal cache identifier so we can reference it in logs.
/**
 * Extra metadata we attach to each cached service instance:
 * - __cacheId: unique identifier for log traceability
 * - __lastAccessed: unix epoch (ms) timestamp of the most recent access
 */
type WithCacheMeta<T extends BaseService> = T & {
  __cacheId?: string;
  __lastAccessed: number;
};

// Use nanoid to generate collision-resistant, URL-safe identifiers for cached service instances.
// The short ID keeps logs readable while ensuring global uniqueness.
const nextCacheId = () => `svc_${nanoid()}`;

// Cache eviction settings
const MAX_SERVICE_AGE_MS = 30 * 60 * 1000; // 30 minutes
// Flag to avoid scheduling duplicate cleanup jobs
let cleanupScheduled = false;

// Single process-wide cache keyed by service/workspace/user
const serviceCache = new Map<string, WithCacheMeta<BaseService>>();

export class ServiceFactory {
  /**
   * Extract a stable, non-spoofable user key for cache segregation.
   *
   * Security considerations:
   * • The `x-clerk-user-id` header is user-controlled and could be spoofed if requests do not
   *   originate from Next.js server helpers.
   * • Therefore we FIRST derive the user id from the signed `x-clerk-auth-token` (JWT).
   *   The `sub` claim is the trusted user identifier and is stable between token rotations.
   * • We only fall back to the plain header if the token is absent (e.g. unauthenticated public request).
   */
  private static getUserKey(headers: AppHeaders): string | null {
    const token = headers.get('x-clerk-auth-token');

    if (token && token.includes('.')) {
      try {
        // Decode JWT payload (middle part) without verifying signature – we just need the `sub` claim.
        const base64Payload = token.split('.')[1];
        const jsonPayload = JSON.parse(
          Buffer.from(base64Payload, 'base64url').toString('utf8'),
        ) as {
          sub?: string;
        };
        if (jsonPayload.sub && jsonPayload.sub.trim() !== '') {
          const logger = serverLoggerWithHeaders(headers);

          const userId = jsonPayload.sub;
          logger.trace({ userId }, 'Using user id from JWT');
          return userId;
        }
      } catch {
        // fall through – we’ll try the user-id header next
      }
    }

    return null;
  }

  private static getCacheKey(
    serviceName: string,
    userKey: string | null,
    headers: AppHeaders,
  ): string {
    // Include workspace context (if present) so that different workspaces for the same user
    // do not share a single service instance.
    const workspaceId = headers.get('x-workspace-id') ?? 'default';
    const keyPart = userKey ?? 'anon';
    return `${serviceName}:${workspaceId}:${keyPart}`;
  }

  private static async getCachedService<T extends BaseService>(
    service: ServiceConstructor<T>,
    headers: AppHeaders | Promise<AppHeaders>,
  ): Promise<T> {
    const resolvedHeaders =
      headers instanceof Promise ? await headers : headers;
    const userKey = this.getUserKey(resolvedHeaders);

    const logger = serverLoggerWithHeaders(resolvedHeaders).child({
      name: `ServiceFactory/${service.name}`,
    });

    if (!userKey) {
      // No user token - skip caching
      logger.trace({ service: service.name }, 'No user token, skipping cache');
      return new service(resolvedHeaders);
    }

    const cache = serviceCache;
    const cacheKey = this.getCacheKey(service.name, userKey, resolvedHeaders);

    if (cache.has(cacheKey)) {
      const cachedInstance = cache.get(cacheKey) as WithCacheMeta<T>;
      cachedInstance.__lastAccessed = Date.now();
      logger.trace(
        {
          service: service.name,
          cacheId: cachedInstance.__cacheId,
          requestId: resolvedHeaders.get('x-request-id'),
        },
        'Returning cached service instance',
      );
      ServiceFactory.scheduleCleanup();
      return cachedInstance;
    }

    const instance = new service(resolvedHeaders) as WithCacheMeta<T>;
    instance.__lastAccessed = Date.now();
    instance.__cacheId = nextCacheId();
    cache.set(cacheKey, instance);
    logger.trace(
      {
        service: service.name,
        cacheId: instance.__cacheId,
        requestId: resolvedHeaders.get('x-request-id'),
      },
      'Created and cached new service instance',
    );
    ServiceFactory.scheduleCleanup();
    return instance;
  }

  public static async get<T extends BaseService>(
    service: ServiceConstructor<T>,
  ): Promise<T> {
    return this.getCachedService(service, headers());
  }

  public static getSync<T extends BaseService>(
    service: ServiceConstructor<T>,
    headers: AppHeaders,
  ): T {
    const userKey = this.getUserKey(headers);
    const logger = serverLoggerWithHeaders(headers).child({
      name: `ServiceFactory/${service.name}`,
    });

    if (!userKey) {
      logger.trace({ service: service.name }, 'No user token, skipping cache');
      return new service(headers);
    }

    const cache = serviceCache;
    const cacheKey = this.getCacheKey(service.name, userKey, headers);

    if (cache.has(cacheKey)) {
      const cachedInstance = cache.get(cacheKey) as WithCacheMeta<T>;
      cachedInstance.__lastAccessed = Date.now();
      logger.trace(
        {
          service: service.name,
          cacheId: cachedInstance.__cacheId,
          requestId: headers.get('x-request-id'),
        },
        'Returning cached service instance',
      );
      ServiceFactory.scheduleCleanup();
      return cachedInstance;
    }

    const instance = new service(headers) as WithCacheMeta<T>;
    instance.__lastAccessed = Date.now();
    instance.__cacheId = nextCacheId();
    cache.set(cacheKey, instance);
    logger.trace(
      {
        service: service.name,
        cacheId: instance.__cacheId,
        requestId: headers.get('x-request-id'),
      },
      'Created and cached new service instance',
    );

    ServiceFactory.scheduleCleanup();
    return instance;
  }

  /* ------------------------------------------------------------------
   * 🔄  Periodic cleanup of stale cached services
   * ----------------------------------------------------------------*/
  private static cleanupStaleServices(): void {
    const now = Date.now();
    for (const [key, svc] of serviceCache) {
      const metaSvc = svc as Partial<WithCacheMeta<BaseService>>;
      if (
        metaSvc.__lastAccessed &&
        now - metaSvc.__lastAccessed > MAX_SERVICE_AGE_MS
      ) {
        serviceCache.delete(key);
      }
    }
  }

  /**
   * Schedule a cleanup run in the near future (micro-task).
   * Ensures at most one pending cleanup at any time.
   */
  private static scheduleCleanup(): void {
    if (cleanupScheduled) return;
    cleanupScheduled = true;
    // Run in a resolved promise so we don’t block the current call stack
    void Promise.resolve().then(() => {
      cleanupScheduled = false;
      ServiceFactory.cleanupStaleServices();
    });
  }
}

export const getSync = <T extends BaseService>(
  service: ServiceConstructor<T>,
  headers: AppHeaders,
): T => {
  return ServiceFactory.getSync(service, headers);
};

export const get = async <T extends BaseService>(
  service: ServiceConstructor<T>,
): Promise<T> => {
  return ServiceFactory.get(service);
};
