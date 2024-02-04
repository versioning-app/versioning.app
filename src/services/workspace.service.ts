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

export class WorkspaceService extends BaseService {
  public constructor() {
    super();
  }

  public get shouldCache(): boolean {
    return process.env.ENABLE_WORKSPACE_CACHE === 'true';
  }

  public async currentWorkspaceId(): Promise<string> {
    const { userId, orgId, sessionClaims } = auth();
    return this.getWorkspaceIdFromAuth({ userId, orgId, sessionClaims });
  }

  public async getWorkspaceIdFromAuth(
    auth: Pick<AuthObject, 'userId' | 'orgId' | 'sessionClaims'>
  ): Promise<string> {
    const { userId, orgId, sessionClaims } = auth;

    this.logger.debug(
      { userId, orgId, sessionClaims },
      'Getting current workspace ID'
    );

    if (!userId) {
      this.logger.error('No user, cannot get workspace');
      throw new Error('No user');
    }

    // If we have an org ID, we're looking for an organization workspace
    if (orgId) {
      let orgMeta = sessionClaims?.org_meta;

      // This should never happen, but if it does, it's likely the first time an org has been created
      // If this is true, let's fetch the public metadata via the API instead of using session
      // Really love the additional network round trip because I cannot force a session refresh
      if (!orgMeta?.workspaceId) {
        this.logger.debug('No organization metadata found, fetching from API');

        const { publicMetadata } =
          await clerkClient.organizations.getOrganization({
            organizationId: orgId,
          });

        if (!publicMetadata?.workspaceId) {
          this.logger.warn(
            { publicMetadata },
            'No public metadata found for organization'
          );
          throw new Error('No workspace ID found');
        }

        orgMeta = publicMetadata;

        this.logger.debug({ orgMeta }, 'Organization metadata found from API');
      }

      const orgWorkspaceId = orgMeta.workspaceId;

      if (!orgWorkspaceId) {
        throw new Error('No workspace ID found');
      }

      this.logger.debug(
        { orgWorkspaceId },
        'Workspace ID found for organization'
      );
      return orgWorkspaceId;
    }

    let userMeta = sessionClaims?.user_meta;

    this.logger.debug({ userMeta }, 'User metadata found from session');

    // This should never happen, but if it does, it's likely the first time a user is logging in
    // If this is true, let's fetch the public metadata via the API instead of using session
    // Really love the additional network round trip because I cannot force a session refresh
    if (!userMeta?.workspaceId) {
      this.logger.debug('No user metadata found, fetching from API');

      const { publicMetadata } = await clerkClient.users.getUser(userId);

      if (!publicMetadata?.workspaceId) {
        this.logger.warn(
          { publicMetadata },
          'No public metadata found for user'
        );
        throw new Error('No workspace ID found');
      }

      userMeta = publicMetadata;

      this.logger.debug({ userMeta }, 'User metadata found from API');
    }

    const userWorkspaceId = userMeta?.workspaceId;

    this.logger.debug({ userWorkspaceId }, 'Workspace ID found for user');

    if (!userWorkspaceId) {
      throw new Error('No workspace ID found');
    }

    this.logger.debug({ userWorkspaceId }, 'Workspace ID found for user');
    return userWorkspaceId;
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

    this.logger.debug({ userId, orgId }, 'Workspace does not exist, creating');

    await this.createWorkspace({ userId, orgId });
    return this.currentWorkspace({ userId, orgId });
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

  public async ensureWorkspace({
    orgId,
    userId,
    sessionClaims,
  }: Pick<AuthObject, 'userId' | 'orgId' | 'sessionClaims'>): Promise<
    'ready' | 'linked'
  > {
    this.logger.debug({ orgId, userId, sessionClaims }, 'Ensuring workspace');

    if (!userId) {
      this.logger.error('No user, cannot ensure workspace');
      throw new Error('No user');
    }

    try {
      if (await this.getWorkspaceIdFromAuth({ userId, orgId, sessionClaims })) {
        this.logger.info('Workspace already linked and exists');
        return 'ready';
      }
    } catch (error: unknown) {
      if ((error as Error)?.message !== 'No workspace ID found') {
        throw error;
      }

      this.logger.debug('No workspace found, linking');
    }

    const workspace = await this.currentWorkspace({
      userId: userId,
      orgId: orgId ?? undefined,
    });

    await this.linkWorkspaceToClerk({
      workspaceId: workspace.id,
      userId: userId,
      orgId: orgId ?? undefined,
    });

    return 'linked';
  }

  // TODO: Use this method to link stripe customer to clerk
  public async linkWorkspaceToClerk({
    workspaceId,
    userId,
    orgId,
  }: Pick<AuthObject, 'userId' | 'orgId'> & { workspaceId: string }) {
    if (!userId) {
      this.logger.warn('No user provided to link workspace');
      return;
    }

    if (orgId) {
      this.logger.debug({ workspaceId }, 'Linking workspace to organization');

      await clerkClient.organizations.updateOrganization(orgId, {
        publicMetadata: {
          workspaceId,
        },
      });

      this.logger.info({ workspaceId }, 'Workspace linked to organization');
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
