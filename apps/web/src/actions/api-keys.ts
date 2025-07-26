import 'server-only';

import { BaseService } from '@/services/base.service';
import { type AppHeaders } from '@/types/headers';
import { headers } from 'next/headers';
import { serverLoggerWithHeaders } from '@/lib/serverLogger'; // adjust path

type ServiceConstructor<T extends BaseService> = new (headers: AppHeaders) => T;

const requestCache = new WeakMap<AppHeaders, Map<string, BaseService>>();

export class ServiceFactory {
  private static getUserKey(headers: AppHeaders): string | null {
    const token = headers.get('x-clerk-auth-token');
    if (!token || token.trim() === '') {
      return null;
    }
    return token;
  }

  private static getServiceCacheForRequest(
    headers: AppHeaders,
  ): Map<string, BaseService> {
    let cache = requestCache.get(headers);
    if (!cache) {
      cache = new Map();
      requestCache.set(headers, cache);
    }
    return cache;
  }

  private static async getCachedService<T extends BaseService>(
    service: ServiceConstructor<T>,
    headers: AppHeaders | Promise<AppHeaders>,
  ): Promise<T> {
    const resolvedHeaders =
      headers instanceof Promise ? await headers : headers;
    const userKey = this.getUserKey(resolvedHeaders);

    const logger = serverLoggerWithHeaders(resolvedHeaders);

    if (!userKey) {
      // No user token — skip caching
      logger.debug({ service: service.name }, 'No user token, skipping cache');
      return new service(resolvedHeaders);
    }

    const cache = this.getServiceCacheForRequest(resolvedHeaders);
    const cacheKey = `${service.name}:${userKey}`;

    if (cache.has(cacheKey)) {
      logger.debug(
        { service: service.name, userKey },
        'Returning cached service instance',
      );
      return cache.get(cacheKey) as T;
    }

    const instance = new service(resolvedHeaders);
    cache.set(cacheKey, instance);
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
    const logger = serverLoggerWithHeaders(headers);

    if (!userKey) {
      logger.debug({ service: service.name }, 'No user token, skipping cache');
      return new service(headers);
    }

    const cache = this.getServiceCacheForRequest(headers);
    const cacheKey = `${service.name}:${userKey}`;

    if (cache.has(cacheKey)) {
      logger.debug(
        { service: service.name, userKey },
        'Returning cached service instance',
      );
      return cache.get(cacheKey) as T;
    }

    const instance = new service(headers);
    cache.set(cacheKey, instance);

    return instance;
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
