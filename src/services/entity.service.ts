import { DEFAULT_DB_CACHE_MS } from '@/config/storage';
import { db } from '@/database/db';
import { Entity, entities } from '@/database/schema';
import { BaseService } from '@/services/base.service';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export class EntityService extends BaseService {
  private readonly cache: Map<string, { entity: Entity; expiry: number }> =
    new Map();

  public constructor() {
    super();
  }

  public async currentEntity(): Promise<Entity> {
    const { userId, orgId } = auth();

    if (!userId) {
      this.logger.error('No user, cannot get entity');
      throw new Error('No user');
    }

    const clerkId = orgId || userId;
    const cached = this.cache.get(clerkId);

    if (cached) {
      if (cached.expiry > Date.now()) {
        const { entity } = cached;
        this.logger.debug({ clerkId, cached }, 'Found entity in cache');
        return entity;
      }

      this.cache.delete(clerkId);
      this.logger.debug(
        { clerkId },
        'Entity cache expired, will fetch from DB'
      );
    }

    const existing = await db
      .selectDistinct()
      .from(entities)
      .where(
        and(
          eq(entities.type, orgId ? 'organization' : 'user'),
          eq(entities.clerkId, clerkId)
        )
      );

    const existingEntity = existing?.[0];

    // If the entity exists, return it
    if (existingEntity) {
      this.logger.debug(
        { existingEntity },
        `Found existing entity for ${orgId ? 'organization' : 'user'}, caching`
      );

      this.cache.set(clerkId, {
        entity: existingEntity,
        expiry: Date.now() + DEFAULT_DB_CACHE_MS,
      });
      return existingEntity;
    }

    this.logger.debug({ orgId, userId }, 'Entity does not exist, creating');

    await this.createEntity({ orgId, userId });
    return this.currentEntity();
  }

  public async createEntity({
    orgId,
    userId,
  }: {
    userId: string;
    orgId?: string;
  }): Promise<Entity> {
    this.logger.debug({ orgId, userId }, 'Creating entity');

    const [newEntity] = await db
      .insert(entities)
      .values({
        type: orgId ? 'organization' : 'user',
        clerkId: orgId || userId,
      })
      .returning();

    this.logger.info({ newEntity }, 'Entity created');
    return newEntity;
  }
}
