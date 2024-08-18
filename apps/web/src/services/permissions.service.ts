import {
  member_permissions,
  Permission,
  PermissionAction,
  Permissions,
  permissions,
  role_permissions,
} from '@/database/schema';
import { MembersService } from '@/services/members.service';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { inArray, and, eq } from 'drizzle-orm';
import 'server-only';
import multimatch from 'multimatch';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';

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

  public async hasDbPermission(
    action: PermissionAction,
    ...resources: string[]
  ) {
    return this.hasPermission(resources, action, 'db');
  }

  public async hasApiPermission(
    action: PermissionAction,
    ...resources: string[]
  ) {
    return this.hasPermission(resources, action, 'api');
  }

  public parseResourceGlob(resource: string): string[] {
    if (!resource.startsWith('[') || !resource.endsWith(']')) {
      return [resource];
    }

    this.logger.debug({ resource }, 'Parsing resource glob');

    try {
      const parsed = JSON.parse(resource);

      if (
        parsed &&
        Array.isArray(parsed) &&
        parsed.every((r) => typeof r === 'string')
      ) {
        this.logger.debug({ parsed }, 'Parsed resource glob');
        return parsed;
      }

      throw new AppError('Invalid resource glob', ErrorCodes.INVALID_REQUEST);
    } catch (error) {
      this.logger.error(
        { error },
        'Error parsing resource glob, returning empty resource',
      );

      return [];
    }
  }

  public checkPermission(
    permission: Permission,
    resource: string,
    action: PermissionAction,
    type: Permissions,
    workspaceId: string,
  ) {
    if (
      permission.workspaceId !== workspaceId ||
      permission.type !== type ||
      (permission.action !== action && permission.action !== 'manage')
    ) {
      return false;
    }

    if (!permission.isPattern) {
      this.logger.debug(
        { resource },
        'Determined permission based on resource',
      );
      return permission.resource === resource;
    }

    const parsedGlob = this.parseResourceGlob(permission.resource);

    const matches = multimatch(resource, parsedGlob);

    this.logger.debug(
      { resource, parsedGlob, matches },
      'Determined permission based on glob',
    );

    return matches.length > 0;
  }

  /**
   * Check if the user has permission for all resources
   *
   * @param resources Resources to check for permissions
   * @param type type of permission to check
   * @returns true if the user has permission for all resources
   */
  public async hasPermission(
    resources: string[],
    action: PermissionAction,
    type: Permissions = 'db',
    cachedPermissions?: Permission[],
  ) {
    let has = false;

    // we need to get the member here and also check the roles?
    const workspaceId = await this.currentWorkspaceId;

    try {
      const permissions =
        cachedPermissions ?? (await this.getCurrentPermissions());

      has = resources.every((resource) =>
        permissions.some((permission) =>
          this.checkPermission(permission, resource, action, type, workspaceId),
        ),
      );
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
