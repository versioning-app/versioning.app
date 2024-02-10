import { appConfig } from '@/config/app';
import { DEFAULT_DB_CACHE_MS } from '@/config/storage';
import { db } from '@/database/db';
import { Workspace, workspaces } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { redis } from '@/lib/redis';
import { BaseService } from '@/services/base.service';
import { auth, clerkClient } from '@clerk/nextjs';
import { AuthObject, SignedInAuthObject } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
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

    return this.getWorkspaceIdFromAuth({
      userId,
      orgId,
      sessionClaims,
    });
  }

  public async getOrganizationCustomerDetails(): Promise<{
    id: string;
    type: 'organization';
    email: string;
    name: string;
  }> {
    const { orgId } = auth();

    if (!orgId) {
      throw new AppError(
        'Organization does not exist in session',
        ErrorCodes.ORGANIZATION_NOT_FOUND
      );
    }

    const organization = await clerkClient.organizations.getOrganization({
      organizationId: orgId,
    });

    if (!organization) {
      throw new AppError(
        'Organization not found',
        ErrorCodes.RESOURCE_NOT_FOUND
      );
    }

    const creators =
      (await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: 10,
      })) ?? [];

    const { publicUserData } = creators
      ?.filter((creator) => creator.role === appConfig.organization.creatorRole)
      ?.sort((a, b) => a.createdAt - b.createdAt)?.[0];

    if (!publicUserData?.userId) {
      throw new AppError(
        'No creator found for organization',
        ErrorCodes.RESOURCE_NOT_FOUND
      );
    }

    const creator = await clerkClient.users.getUser(publicUserData.userId);

    const primaryEmail = creator?.emailAddresses?.find(
      (email) => email.id === creator.primaryEmailAddressId
    );

    if (!primaryEmail?.emailAddress) {
      throw new AppError(
        'No primary email found for organization creator',
        ErrorCodes.RESOURCE_NOT_FOUND
      );
    }

    return {
      id: orgId,
      type: 'organization',
      email: primaryEmail.emailAddress,
      name: organization.name,
    };
  }

  public async getUserCustomerDetails(): Promise<{
    id: string;
    type: 'user';
    email: string;
    name: string;
  }> {
    const { userId } = auth();

    if (!userId) {
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND
      );
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      throw new AppError('User not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    const primaryEmail = user?.emailAddresses?.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail?.emailAddress) {
      throw new AppError(
        'No primary email found for user',
        ErrorCodes.RESOURCE_NOT_FOUND
      );
    }

    return {
      id: userId,
      type: 'user',
      email: primaryEmail.emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    };
  }

  public async getCustomerDetails(): Promise<{
    id: string;
    type: 'user' | 'organization';
    email: string;
    name: string;
  }> {
    const { userId, orgId, organization } = auth();

    if (!userId) {
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND
      );
    }

    if (orgId) {
      return this.getOrganizationCustomerDetails();
    }

    return this.getUserCustomerDetails();
  }

  public async getWorkspaceIdFromAuth(
    auth: Pick<AuthObject, 'userId' | 'orgId' | 'sessionClaims'>
  ): Promise<string> {
    noStore();
    const { userId, orgId, sessionClaims } = auth;

    const workspaceNotFoundError = new AppError(
      'No workspace ID found',
      ErrorCodes.WORKSPACE_NOT_FOUND
    );

    this.logger.debug(
      { userId, orgId, sessionClaims },
      'Getting current workspace ID'
    );

    if (!userId) {
      this.logger.error('No user, cannot get workspace');
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND
      );
    }

    // If we have an org ID, we're looking for an organization workspace
    if (orgId) {
      let orgWorkspaceId = sessionClaims?.org_workspaceId;

      // This should never happen, but if it does, it's likely the first time an org has been created
      // If this is true, let's fetch the public metadata via the API instead of using session
      // Really love the additional network round trip because I cannot force a session refresh
      if (!orgWorkspaceId) {
        ('No organization workspaceId found, fetching public metadata from API');

        const { publicMetadata } =
          await clerkClient.organizations.getOrganization({
            organizationId: orgId,
          });

        if (!publicMetadata?.workspaceId) {
          this.logger.warn(
            { publicMetadata },
            'No workspaceId found in public metadata found for organization'
          );
          throw workspaceNotFoundError;
        }

        orgWorkspaceId = publicMetadata.workspaceId;

        this.logger.info(
          { publicMetadata, orgWorkspaceId },
          'Organization workspaceId found in public metadata from API'
        );
      }

      if (!orgWorkspaceId) {
        throw workspaceNotFoundError;
      }

      this.logger.debug(
        { orgWorkspaceId },
        'Workspace ID found for organization'
      );
      return orgWorkspaceId;
    }

    let userWorkspaceId = sessionClaims?.user_workspaceId;

    // This should never happen, but if it does, it's likely the first time a user is logging in
    // If this is true, let's fetch the public metadata via the API instead of using session
    // Really love the additional network round trip because I cannot force a session refresh
    if (!userWorkspaceId) {
      this.logger.debug(
        'No user workspaceId found, fetching public metadata from API'
      );

      const { publicMetadata } = await clerkClient.users.getUser(userId);

      if (!publicMetadata?.workspaceId) {
        this.logger.warn(
          { publicMetadata },
          'No workspaceId found in public metadata found for user'
        );
        throw workspaceNotFoundError;
      }

      userWorkspaceId = publicMetadata.workspaceId;

      this.logger.info(
        { publicMetadata, userWorkspaceId },
        'User workspaceId found in public metadata from API'
      );
    }

    this.logger.debug({ userWorkspaceId }, 'Workspace ID found for user');

    if (!userWorkspaceId) {
      throw workspaceNotFoundError;
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
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND
      );
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
  }: Pick<AuthObject, 'userId' | 'orgId' | 'sessionClaims'>): Promise<{
    status: 'ready' | 'linked';
    workspaceId: string;
  }> {
    this.logger.debug({ orgId, userId, sessionClaims }, 'Ensuring workspace');

    if (!userId) {
      this.logger.error('No user, cannot ensure workspace');
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND
      );
    }

    try {
      const workspaceId = await this.getWorkspaceIdFromAuth({
        userId,
        orgId,
        sessionClaims,
      });
      if (workspaceId) {
        this.logger.info('Workspace already linked and exists');
        return { status: 'ready', workspaceId };
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

    return { status: 'linked', workspaceId: workspace.id };
  }

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

  public async linkStripeCustomer(stripeCustomerId: string) {
    const workspace = await this.currentWorkspace();

    this.logger.debug(
      { stripeCustomerId, workspace },
      'Linking stripe customer to workspace'
    );

    await db
      .update(workspaces)
      .set({ stripeCustomerId })
      .where(eq(workspaces.id, workspace.id));

    this.logger.info(
      { stripeCustomerId, workspace },
      'Stripe customer linked to workspace'
    );
  }
}
