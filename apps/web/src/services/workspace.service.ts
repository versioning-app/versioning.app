import { appConfig } from '@/config/app';
import { DisallowedSlugs } from '@/config/navigation';
import { API_KEY_HEADER, DEFAULT_DB_CACHE_MS } from '@/config/storage';
import { db } from '@/database/db';
import { Workspace, members, workspaces } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { redis } from '@/lib/redis';
import { BaseService } from '@/services/base.service';
import { type AppHeaders } from '@/types/headers';
import { AuthObject } from '@clerk/backend';
import { SignedInAuthObject } from '@clerk/backend/internal';
import { auth, clerkClient } from '@clerk/nextjs/server';
import cryptoRandomString from 'crypto-random-string';
import { and, eq, sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { headers } from 'next/headers';
import 'server-only';
import slugify from 'slugify';

export class WorkspaceService extends BaseService {
  public constructor(headers: AppHeaders) {
    super(headers);
  }

  public get shouldCache(): boolean {
    return process.env.APP_ENABLE_WORKSPACE_CACHE === 'true';
  }

  public async currentWorkspaceId(): Promise<string> {
    const providedApiKey = (await headers()).get(API_KEY_HEADER);

    if (providedApiKey) {
      this.logger.debug('Getting workspace ID from API key');

      const apiKey = await db.query.api_keys.findFirst({
        where: (apiKeys, { gt, eq, and }) =>
          and(eq(apiKeys.key, providedApiKey)),
      });

      if (
        !apiKey?.workspaceId ||
        (apiKey.expiresAt && apiKey.expiresAt < new Date())
      ) {
        throw new AppError('API Key is invalid', ErrorCodes.API_KEY_INVALID);
      }

      const workspaceId = apiKey.workspaceId;

      this.logger.info({ workspaceId }, 'Workspace ID found from API key');
      return workspaceId;
    }

    this.logger.debug('Getting workspace ID from session');

    const { userId, orgId, sessionClaims } = await auth();

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
    const { orgId } = await auth();

    if (!orgId) {
      throw new AppError(
        'Organization does not exist in session',
        ErrorCodes.ORGANIZATION_NOT_FOUND,
      );
    }

    const organization = await clerkClient.organizations.getOrganization({
      organizationId: orgId,
    });

    if (!organization) {
      throw new AppError(
        'Organization not found',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    const creators =
      (
        await clerkClient.organizations.getOrganizationMembershipList({
          organizationId: orgId,
          limit: 1,
        })
      ).data ?? [];

    const { publicUserData } = creators
      ?.filter(
        (creator: any) => creator.role === appConfig.organization.creatorRole,
      )
      ?.sort((a, b) => a.createdAt - b.createdAt)?.[0];

    if (!publicUserData?.userId) {
      throw new AppError(
        'No creator found for organization',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    const creator = await clerkClient.users.getUser(publicUserData.userId);

    const primaryEmail = creator?.emailAddresses?.find(
      (email) => email.id === creator.primaryEmailAddressId,
    );

    if (!primaryEmail?.emailAddress) {
      throw new AppError(
        'No primary email found for organization creator',
        ErrorCodes.RESOURCE_NOT_FOUND,
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
    const { userId } = await auth();

    if (!userId) {
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      throw new AppError('User not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    const primaryEmail = user?.emailAddresses?.find(
      (email) => email.id === user.primaryEmailAddressId,
    );

    if (!primaryEmail?.emailAddress) {
      throw new AppError(
        'No primary email found for user',
        ErrorCodes.RESOURCE_NOT_FOUND,
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
    const { userId, orgId } = await auth();

    if (!userId) {
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    if (orgId) {
      return this.getOrganizationCustomerDetails();
    }

    return this.getUserCustomerDetails();
  }

  public async getWorkspaceIdFromAuth(
    auth: Pick<AuthObject, 'userId' | 'orgId' | 'sessionClaims'>,
  ): Promise<string> {
    noStore();
    const { userId, orgId, sessionClaims } = auth;

    const workspaceNotFoundError = new AppError(
      'No workspace ID found',
      ErrorCodes.WORKSPACE_NOT_FOUND,
    );

    this.logger.debug(
      { userId, orgId, sessionClaims },
      'Getting current workspace ID',
    );

    if (!userId) {
      this.logger.error('No user, cannot get workspace');
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
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
            'No workspaceId found in public metadata found for organization',
          );
          throw workspaceNotFoundError;
        }

        orgWorkspaceId = publicMetadata.workspaceId;

        this.logger.info(
          { publicMetadata, orgWorkspaceId },
          'Organization workspaceId found in public metadata from API',
        );
      }

      if (!orgWorkspaceId) {
        throw workspaceNotFoundError;
      }

      this.logger.debug(
        { orgWorkspaceId },
        'Workspace ID found for organization',
      );
      return orgWorkspaceId;
    }

    let userWorkspaceId = sessionClaims?.user_workspaceId;

    // This should never happen, but if it does, it's likely the first time a user is logging in
    // If this is true, let's fetch the public metadata via the API instead of using session
    // Really love the additional network round trip because I cannot force a session refresh
    if (!userWorkspaceId) {
      this.logger.debug(
        'No user workspaceId found, fetching public metadata from API',
      );

      const { publicMetadata } = await clerkClient.users.getUser(userId);

      if (!publicMetadata?.workspaceId) {
        this.logger.warn(
          { publicMetadata },
          'No workspaceId found in public metadata found for user',
        );
        throw workspaceNotFoundError;
      }

      userWorkspaceId = publicMetadata.workspaceId;

      this.logger.info(
        { publicMetadata, userWorkspaceId },
        'User workspaceId found in public metadata from API',
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
    authObject?: Pick<SignedInAuthObject, 'userId' | 'orgId'>,
  ): Promise<Workspace> {
    const { userId, orgId } = authObject ?? auth();

    if (!userId) {
      this.logger.error('No user, cannot get workspace');
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
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
          eq(workspaces.clerkId, clerkId),
        ),
      );

    const existingWorkspace = existing?.[0];

    // If the workspace exists, return it
    if (existingWorkspace) {
      this.logger.debug(
        { existingWorkspace },
        `Found existing workspace for ${orgId ? 'organization' : 'user'}`,
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

  public async getWorkspaceFromSlug(
    slug: string,
  ): Promise<Workspace | undefined> {
    try {
      const workspaceBySlug = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.slug, slug));

      return workspaceBySlug?.[0];
    } catch (error: unknown) {
      this.logger.error({ slug, error }, 'Error fetching workspace from slug');
      return undefined;
    }
  }

  public async generateSlugForWorkspace({
    userId,
    orgId,
  }: Pick<SignedInAuthObject, 'userId' | 'orgId'>): Promise<string> {
    if (!userId) {
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    if (orgId) {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: orgId,
      });

      if (!organization) {
        throw new AppError(
          'Organization not found',
          ErrorCodes.ORGANIZATION_NOT_FOUND,
        );
      }

      return slugify(
        organization.slug ?? organization.name ?? orgId,
      ).toLowerCase();
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      throw new AppError('User not found', ErrorCodes.USER_NOT_FOUND);
    }

    const name = `${user.firstName} ${user.lastName}`;
    const username = user.username ?? user.emailAddresses?.[0]?.emailAddress;

    return slugify(name.length >= 6 ? name : username || userId).toLowerCase();
  }

  public async getWorkspaceById(workspaceId: string): Promise<Workspace> {
    const workspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

    if (!workspace) {
      throw new AppError('Workspace not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return workspace[0];
  }

  public async isValidSlug(slug: string) {
    return (
      !DisallowedSlugs.includes(slug) &&
      (await this.getWorkspaceFromSlug(slug)) === undefined
    );
  }

  public async changeSlug(updateData: { slug: string }) {
    const slug = updateData.slug.toLowerCase();

    const workspace = await this.currentWorkspace();

    if (workspace.slug === slug) {
      throw new AppError(
        'Slug is the same as current slug',
        ErrorCodes.WORKSPACE_SLUG_UNAVAILABLE,
      );
    }

    if (!(await this.isValidSlug(slug))) {
      throw new AppError(
        'Slug is not available',
        ErrorCodes.WORKSPACE_SLUG_UNAVAILABLE,
      );
    }

    this.logger.debug({ slug }, 'Changing workspace slug');

    const currentClerkId = await this.currentClerkId();

    const updatedWorkspaces = await db
      .update(workspaces)
      .set({ slug })
      .where(
        and(
          eq(workspaces.id, workspace.id),
          eq(workspaces.clerkId, currentClerkId),
        ),
      )
      .returning();

    if (updatedWorkspaces?.[0]?.slug !== slug) {
      throw new AppError(
        'Error updating workspace slug',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    const { orgId, userId } = await auth();

    await this.linkWorkspaceToClerk({
      workspaceId: workspace.id,
      slug,
      userId,
      orgId,
    });

    this.logger.info({ slug }, 'Workspace slug changed');
    return updatedWorkspaces[0];
  }

  public async generateUniqueSlug({
    generatedSlug,
  }: {
    generatedSlug: string;
  }): Promise<string> {
    let slug: string | undefined;
    do {
      if (!slug) {
        slug = generatedSlug;
        this.logger.debug({ slug }, 'Attempting to use generated slug');
        continue;
      }

      this.logger.debug(
        { slug, generatedSlug },
        'Slug exists, appending random string',
      );

      slug = `${generatedSlug}-${cryptoRandomString({ length: 8 })}`;
    } while (!(await this.isValidSlug(slug)));

    this.logger.info({ slug }, 'Generated unique slug');
    return slug;
  }

  public async currentClerkId(): Promise<string> {
    const { orgId, userId } = await auth();

    if (!userId) {
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    return orgId || userId;
  }

  public async createWorkspace({
    orgId,
    userId,
  }: Pick<SignedInAuthObject, 'userId' | 'orgId'>): Promise<Workspace> {
    this.logger.debug({ orgId, userId }, 'Creating workspace');

    const generatedSlug = await this.generateSlugForWorkspace({
      userId,
      orgId,
    });

    const slug = await this.generateUniqueSlug({ generatedSlug });

    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        slug,
        type: orgId ? 'organization' : 'user',
        clerkId: orgId || userId,
      })
      .returning();

    if (!newWorkspace) {
      throw new AppError(
        'Error creating workspace',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    this.logger.info({ newWorkspace }, 'Workspace created');

    return newWorkspace;
  }

  public async ensureWorkspace({
    orgId,
    userId,
    sessionClaims,
  }: Pick<AuthObject, 'userId' | 'orgId' | 'sessionClaims'>): Promise<{
    status: 'ready' | 'linked';
    workspace: Workspace;
  }> {
    this.logger.debug({ orgId, userId, sessionClaims }, 'Ensuring workspace');

    if (!userId) {
      this.logger.error('No user, cannot ensure workspace');
      throw new AppError(
        'User does not exist in session',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    try {
      const workspaceId = await this.getWorkspaceIdFromAuth({
        userId,
        orgId,
        sessionClaims,
      });

      if (workspaceId) {
        const workspace = await this.getWorkspaceById(workspaceId);

        if (workspace?.clerkId !== (orgId || userId)) {
          this.logger.warn(
            { workspaceId, orgId, userId, workspace },
            'Workspace ID does not match user or organization',
          );

          throw new AppError(
            'Workspace does not exist',
            ErrorCodes.WORKSPACE_NOT_FOUND,
          );
        }

        if (
          (orgId && workspace.slug !== sessionClaims?.org_slug) ||
          (!orgId && workspace.slug !== sessionClaims?.user_slug)
        ) {
          this.logger.debug(
            { orgId, userId, workspace, sessionClaims },
            'Workspace slug does not match, updating',
          );

          await this.link({
            workspaceId,
            slug: workspace.slug,
            userId,
            orgId,
          });
        }

        await this.linkWorkspaceMembership({
          workspaceId,
          clerkId: userId,
        });

        this.logger.info('Workspace already linked and exists');
        return { status: 'ready', workspace };
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

    await this.link({
      workspaceId: workspace.id,
      slug: workspace.slug,
      userId: userId,
      orgId: orgId ?? undefined,
    });

    return { status: 'linked', workspace };
  }

  public async link({
    workspaceId,
    slug,
    userId,
    orgId,
  }: Pick<AuthObject, 'userId' | 'orgId'> & {
    workspaceId: string;
    slug: string;
  }) {
    const workspace = await this.getWorkspaceById(workspaceId);

    // Do parallel linking
    await Promise.all([
      this.linkWorkspaceMembership({
        workspaceId,
        clerkId: userId,
      }),
      this.linkWorkspaceToClerk({
        workspaceId,
        slug,
        userId,
        orgId,
      }),
    ]);

    return workspace;
  }

  public async linkWorkspaceMembership({
    workspaceId,
    clerkId,
  }: {
    workspaceId: string;
    clerkId?: string | null;
  }) {
    if (!clerkId) {
      this.logger.warn('No clerk provided to create workspace membership');
      return;
    }

    this.logger.debug({ workspaceId, clerkId }, 'Linking workspace membership');

    const data = await db
      .insert(members)
      .values({
        workspaceId,
        clerkId,
      })
      .onConflictDoUpdate({
        target: [members.workspaceId, members.clerkId],
        set: {
          modifiedAt: sql`NOW()`,
        },
      })
      .returning();

    if (
      data?.length > 0 &&
      data[0].createdAt.getTime() !== data[0].modifiedAt.getTime()
    ) {
      this.logger.debug(
        { workspaceId, clerkId },
        'Workspace membership already linked',
      );
      return;
    }

    this.logger.info(
      { workspaceId, clerkId },
      'Successfully linked workspace membership',
    );
  }

  public async linkWorkspaceToClerk({
    workspaceId,
    slug,
    userId,
    orgId,
  }: Pick<AuthObject, 'userId' | 'orgId'> & {
    workspaceId: string;
    slug: string;
  }) {
    if (!userId) {
      this.logger.warn('No user provided to link workspace');
      return;
    }

    if (orgId) {
      this.logger.debug({ workspaceId }, 'Linking workspace to organization');

      await clerkClient.organizations.updateOrganization(orgId, {
        publicMetadata: {
          workspaceId,
          slug,
        },
        slug,
      });

      this.logger.info({ workspaceId }, 'Workspace linked to organization');
      return;
    }

    this.logger.debug({ workspaceId }, 'Linking workspace to user');

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        workspaceId,
        slug,
      },
    });

    this.logger.info({ workspaceId }, 'Workspace linked to user');
  }

  public async linkStripeCustomer(stripeCustomerId: string) {
    const workspace = await this.currentWorkspace();

    this.logger.debug(
      { stripeCustomerId, workspace },
      'Linking stripe customer to workspace',
    );

    await db
      .update(workspaces)
      .set({ stripeCustomerId })
      .where(eq(workspaces.id, workspace.id));

    this.logger.info(
      { stripeCustomerId, workspace },
      'Stripe customer linked to workspace',
    );
  }
}
