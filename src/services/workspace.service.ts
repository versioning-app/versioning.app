import { DEFAULT_DB_CACHE_MS, StorageKeys } from '@/config/storage';
import { db } from '@/database/db';
import { Workspace, workspaces } from '@/database/schema';
import { redis } from '@/lib/redis';
import { BaseService } from '@/services/base.service';
import { auth, clerkClient } from '@clerk/nextjs';
import { AuthObject, SignedInAuthObject } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import 'server-only';

type Meta = {
  workspaceId: number;
};

export class WorkspaceService extends BaseService {
  public constructor() {
    super();
  }

  public get shouldCache(): boolean {
    return process.env.ENABLE_WORKSPACE_CACHE === 'true';
  }

  public async currentWorkspaceId(): Promise<number> {
    const { userId, orgId, sessionClaims } = auth();

    this.logger.debug(
      { userId, orgId, sessionClaims },
      'Getting current workspace ID'
    );

    if (!userId) {
      this.logger.error('No user, cannot get workspace');
      throw new Error('No user');
    }

    const workspaceId =
      (sessionClaims?.org_meta as Meta)?.workspaceId ??
      (sessionClaims?.user_meta as Meta)?.workspaceId;

    if (!workspaceId) {
      this.logger.error('No workspace ID found');
      throw new Error('No workspace ID found');
    }

    this.logger.debug({ workspaceId }, 'Workspace ID found');

    return workspaceId;
  }

  public async currentWorkspace(
    authObject?: Pick<SignedInAuthObject, 'userId' | 'orgId'>
  ): Promise<Workspace> {
    const { userId, orgId } = authObject ?? auth();

    if (!userId) {
      this.logger.error('No user, cannot get workspace');
      throw new Error('No user');
    }

    const workspaceCookie = cookies().get(StorageKeys.WORKSPACE_COOKIE_KEY);

    if (workspaceCookie?.value) {
      try {
        this.logger.debug({ workspaceCookie }, 'Found workspace in cookie');
        const parsed = JSON.parse(workspaceCookie.value);
        this.logger.debug({ parsed }, 'Parsed workspace from cookie');
        return parsed;
      } catch {
        this.logger.error(
          { workspaceFromCookie: workspaceCookie },
          'Failed to parse workspace cookie, removing'
        );
        cookies().delete(StorageKeys.WORKSPACE_COOKIE_KEY);
      }
    }

    const clerkId = orgId || userId;

    if (this.shouldCache) {
      const cached = await redis.get<Workspace>(clerkId);

      if (cached) {
        this.logger.debug({ clerkId, cached }, 'Found workspace in cache');
        return cached;
      }
    }

    const existing = await db
      .selectDistinct()
      .from(workspaces)
      .where(
        and(
          eq(workspaces.type, orgId ? 'organization' : 'user'),
          eq(workspaces.clerkId, clerkId)
        )
      );

    const existingWorkspace = existing?.[0];

    // If the workspace exists, return it
    if (existingWorkspace) {
      this.logger.debug(
        { existingWorkspace },
        `Found existing workspace for ${orgId ? 'organization' : 'user'}`
      );

      if (this.shouldCache) {
        this.logger.debug({ clerkId, existingWorkspace }, 'Caching workspace');
        await redis.set(clerkId, existingWorkspace, {
          px: DEFAULT_DB_CACHE_MS,
        });
      }
      return existingWorkspace;
    }

    this.logger.debug({ orgId, userId }, 'Workspace does not exist, creating');

    await this.createWorkspace({ orgId, userId });
    return this.currentWorkspace();
  }

  public async createWorkspace({
    orgId,
    userId,
  }: Pick<SignedInAuthObject, 'userId' | 'orgId'>): Promise<Workspace> {
    this.logger.debug({ orgId, userId }, 'Creating workspace');

    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        type: orgId ? 'organization' : 'user',
        clerkId: orgId || userId,
      })
      .returning();

    this.logger.info({ newWorkspace }, 'Workspace created');
    return newWorkspace;
  }

  // TODO: Use this method to link stripe customer to clerk
  public async linkWorkspaceToClerk({
    workspaceId,
    userId,
    orgId,
  }: Pick<AuthObject, 'userId' | 'orgId'> & { workspaceId: number }) {
    if (!userId) {
      this.logger.warn('No user provided to link workspace');
      return;
    }

    if (orgId) {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: orgId,
      });

      if (organization.publicMetadata?.workspaceId === workspaceId) {
        this.logger.debug(
          { workspaceId },
          'Workspace already linked to organization'
        );
        return;
      }

      this.logger.debug({ workspaceId }, 'Linking workspace to organization');

      await clerkClient.organizations.updateOrganization(orgId, {
        publicMetadata: {
          workspaceId,
        },
      });

      this.logger.info({ workspaceId }, 'Workspace linked to organization');
      return;
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.workspaceId === workspaceId) {
      this.logger.debug({ workspaceId }, 'Workspace already linked to user');
      return;
    }

    this.logger.debug({ workspaceId }, 'Linking workspace to user');

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        workspaceId,
      },
    });

    this.logger.info({ workspaceId }, 'Workspace linked to user');
  }
}
