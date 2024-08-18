import {
  member_roles,
  members,
  NewRole,
  Role,
  roles,
  Workspace,
} from '@/database/schema';
import { CURRENT_PERMISSIONS_VERSION } from '@/permissions/config';
import { SystemRoles } from '@/permissions/defaults';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { and, eq, inArray, InferSelectModel, asc } from 'drizzle-orm';
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

  public async createSystemRoles(workspace: Workspace) {
    if (workspace.permissionsVersion === CURRENT_PERMISSIONS_VERSION) {
      this.logger.debug(
        { workspace },
        'System roles already created for current version',
      );
      return this.findSystemRoles();
    }

    const currentSystemRoles = await this.findSystemRoles();

    const newSystemRoles = SystemRoles.filter(
      (role) =>
        role.meta.createdIn > workspace.permissionsVersion &&
        (!role.meta.deprecatedIn ||
          role.meta.deprecatedIn <= workspace.permissionsVersion),
    );

    const nonExistingRoles = newSystemRoles.filter(
      (role) => !currentSystemRoles.some((r) => r.name === role.name),
    );

    const createdRoles: Role[] = [];

    for (const role of nonExistingRoles) {
      this.logger.debug({ role }, 'Creating system role');

      createdRoles.push(
        await this.create({
          name: role.name,
          description:
            'This role is managed by the system and cannot be deleted or modified',
          system: true,
        }),
      );

      this.logger.info({ role }, 'System role created');
    }

    this.logger.info(
      {
        createdRoles,
        nonExistingRoles,
        currentSystemRoles,
        newSystemRoles,
        workspace,
      },
      'System roles created',
    );

    // For each created role, let's assign to correct member if we have defaults...
    const rolesWithDefaults = nonExistingRoles.filter((role) => role.defaults);

    for (const role of rolesWithDefaults) {
      const dbRole = createdRoles.find((r) => r.name === role.name);

      if (!dbRole) {
        this.logger.error({ role }, 'Role not found in database');
        continue;
      }

      if (role.defaults?.creator) {
        this.logger.debug({ role }, 'Assigning role to all creators');

        const oldestMember = await this.db
          .select()
          .from(members)
          .where(eq(members.workspaceId, workspace.id))
          .orderBy(asc(members.createdAt))
          .limit(1)
          .execute();

        if (!oldestMember?.[0]?.id) {
          this.logger.error({ role }, 'No member found in workspace');
          continue;
        }

        await this.db.insert(member_roles).values({
          memberId: oldestMember[0].id,
          roleId: dbRole.id,
        });
      }

      if (role.defaults?.member) {
        this.logger.debug({ role }, 'Assigning role to all members');

        const allMembers = await this.db
          .select()
          .from(members)
          .where(eq(members.workspaceId, workspace.id))
          .execute();

        for (const member of allMembers) {
          await this.db.insert(member_roles).values({
            memberId: member.id,
            roleId: dbRole.id,
          });
        }
      }
    }

    // Let's return all system roles
    return this.findSystemRoles();
  }

  public async findSystemRoles() {
    return this.findAll(eq(roles.system, true));
  }

  public async create(
    resource: Omit<NewRole, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof roles>> {
    return super.create(resource, eq(roles.name, resource.name));
  }
}
