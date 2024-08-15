import {
  member_permissions,
  Permission,
  Permissions,
  permissions,
  role_permissions,
} from '@/database/schema';
import { MembersService } from '@/services/members.service';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { inArray, and, eq } from 'drizzle-orm';
import 'server-only';

export class PermissionsService extends WorkspaceScopedRepository<
  typeof permissions
> {
  private readonly membersService: MembersService;

  public constructor() {
    super(permissions);

    this.membersService = new MembersService();
  }

  public async getPermissionsForRoles(
    roleIds: string[],
    permissions: Permission[],
  ) {
    const rolePermissions = await this.db
      .select()
      .from(role_permissions)
      .where(
        and(
          inArray(role_permissions.roleId, roleIds),
          inArray(
            role_permissions.permissionId,
            permissions.map((p) => p.id),
          ),
        ),
      )
      .execute();

    return permissions
      .filter((permission) => {
        return rolePermissions.some(
          (rolePermission) => rolePermission.permissionId === permission.id,
        );
      })
      .map((permission) => ({ ...permission, via: 'role' }));
  }

  public async getPermissionsForMembers(
    memberIds: string[],
    permissions: Permission[],
  ) {
    const memberPermissions = await this.db
      .select()
      .from(member_permissions)
      .where(
        and(
          inArray(member_permissions.memberId, memberIds),
          inArray(
            member_permissions.permissionId,
            permissions.map((p) => p.id),
          ),
        ),
      )
      .execute();

    return permissions
      .filter((permission) => {
        return memberPermissions.some(
          (memberPermission) => memberPermission.permissionId === permission.id,
        );
      })
      .map((permission) => ({ ...permission, via: 'member' }));
  }

  public async getCurrentPermissions() {
    const allPermissions = await this.findAll();

    const member = await this.membersService.currentMember;

    const permissionPromises = [
      this.getPermissionsForMembers([member.id], allPermissions),
      this.getPermissionsForRoles(
        (await this.membersService.getCurrentRoles(member)).map(
          (role) => role.id,
        ),
        allPermissions,
      ),
    ];

    const currentPermissions = await Promise.all(permissionPromises);
    return currentPermissions.flat();
  }

  public async hasDbPermission(...resources: string[]) {
    return this.hasPermission(resources, 'db');
  }

  public async hasApiPermission(...resources: string[]) {
    return this.hasPermission(resources, 'api');
  }

  public async hasPermission(resources: string[], type: Permissions = 'db') {
    let has = false;

    // we need to get the member here and also check the roles?
    const workspaceId = await this.currentWorkspaceId;

    try {
      const permissions = await this.getCurrentPermissions();

      // check that every resource has permission
      has = resources.every((resource) => {
        return permissions.some(
          (permission) =>
            permission.workspaceId === workspaceId &&
            permission.resource === resource &&
            permission.type === type,
        );
      });
    } catch (error) {
      this.logger.error({ error }, 'Error trying to determine permissions');
      // Let's force this to have no permission if we fail to calculate as a fail-safe
      has = false;
    } finally {
      this.logger.info(
        { resources, type, has },
        'Evaluated permissions for resources',
      );

      return has;
    }
  }
}
