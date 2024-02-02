'use server';

import { db } from '@/database/db';
import { entities } from '@/database/schema';
import { serverLogger } from '@/lib/logger/server';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';

export const getEntity = async () => {
  const { userId, orgId } = auth();

  const logger = serverLogger();

  if (!userId) {
    logger.error('No user, cannot get entity');
    return undefined;
  }

  const existing = await db
    .selectDistinct()
    .from(entities)
    .where(
      and(
        eq(entities.type, orgId ? 'organization' : 'user'),
        eq(entities.clerkId, orgId || userId)
      )
    );

  // If the entity exists, return it
  if (existing?.[0]) {
    logger.info({ existing: existing[0] }, 'Entity exists, returning');
    return existing[0];
  }

  logger.debug({ orgId, userId }, 'Entity does not exist, creating');

  // Otherwise, create a new entity
  const [newEntity] = await db
    .insert(entities)
    .values({
      type: orgId ? 'organization' : 'user',
      clerkId: orgId || userId,
    })
    .returning();

  logger.info({ newEntity }, 'Entity created');

  return newEntity;
};
