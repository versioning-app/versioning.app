import { Navigation } from '@/config/nav';
import { db } from '@/database/db';
import { entities } from '@/database/schema';
import { serverLogger } from '@/lib/logger/server';
import { auth, clerkClient } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const getOrganization = async (organizationId: string | null | undefined) => {
  if (!organizationId) {
    return undefined;
  }

  return await clerkClient.organizations.getOrganization({
    organizationId,
  });
};

export const getEntity = async ({
  userId,
  orgId,
}: {
  userId: string;
  orgId?: string;
}) => {
  const logger = serverLogger();

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

export default async function Dashboard() {
  const { orgId, userId } = auth();

  if (!userId) {
    return redirect(Navigation.HOME);
  }

  // const organization = await getOrganization(orgId);

  const entity = await getEntity({ userId, orgId });

  return (
    <div>
      <p>Welcome to your dashboard</p>
      {/* {organization && <p>You are a member of {organization.name}</p>} */}
      {entity && <pre>{JSON.stringify(entity, null, 2)}</pre>}
    </div>
  );
}
