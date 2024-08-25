import {
  Member,
  member_roles,
  members,
  NewMember,
  Role,
  roles,
} from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { RolesService } from '@/services/roles.service';
import { auth } from '@clerk/nextjs/server';
import { eq, InferSelectModel } from 'drizzle-orm';
import 'server-only';

export class MembersService extends WorkspaceScopedRepository<typeof members> {
  private readonly rolesService: RolesService;

  public constructor() {
    super(members);
    this.rolesService = new RolesService();
  }

  public get currentMember(): Promise<Member> {
    const currentAuth = auth();

    const { userId } = currentAuth;

    if (!userId) {
      throw new AppError(
        'Unable to determine current user',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    return this.findOneBy(eq(members.clerkId, userId));
  }

  public async getCurrentRoles(member?: Member): Promise<Role[]> {
    const currentMember = member ?? (await this.currentMember);

    if (!currentMember) {
      throw new AppError(
        'Unable to determine current user',
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    return this.rolesService.findByMemberId(currentMember.id);
  }

  public async create(
    _resource: Omit<NewMember, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof members>> {
    throw new AppError(
      'Unable to create members via service',
      ErrorCodes.STRIPE_UNHANDLED_WEBHOOK_EVENT,
    );
  }
}
