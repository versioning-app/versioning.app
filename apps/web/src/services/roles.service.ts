import { member_roles, NewRole, roles } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { eq, and, InferSelectModel, inArray } from 'drizzle-orm';
import 'server-only';

export class RolesService extends WorkspaceScopedRepository<typeof roles> {
  public constructor() {
    super(roles);
  }

  public async findByMemberId(memberId: string) {
    const allRoles = await this.findAll();

    const memberRoles = await this.db
      .select()
      .from(member_roles)
      .where(
        and(
          eq(member_roles.memberId, memberId),
          inArray(
            member_roles.roleId,
            allRoles.map((r) => r.id),
          ),
        ),
      )
      .execute();

    return allRoles.filter((r) => memberRoles.some((mr) => mr.roleId === r.id));
  }

  public async create(
    resource: Omit<NewRole, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof roles>> {
    return super.create(resource, eq(roles.name, resource.name));
  }
}
