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

    const permissions = currentPermissions.flat();

    this.logger.debug({ permissions }, 'Current permissions for user');

    return permissions;
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

  public getPermissionActionsByType(type: Permissions): PermissionAction[] {
    if (type === 'db') {
      return ['read', 'create', 'update', 'delete', 'manage'];
    }

    if (type === 'api' || type === 'action') {
      return ['execute'];
    }

    throw new AppError('Invalid permission type', ErrorCodes.INVALID_REQUEST);
  }

  public checkPermission(
    permission: Permission,
    resource: string,
    action: PermissionAction,
    type: Permissions,
    workspaceId: string,
  ) {
    const allowedActions = this.getPermissionActionsByType(type);

    if (!allowedActions.includes(action)) {
      this.logger.warn(
        { action, allowedActions, permissions, permission, type, workspaceId },
        'Invalid action for permission check',
      );
      return false;
    }

    if (
      permission.scope === 'workspace' &&
      workspaceId !== permission.workspaceId
    ) {
      this.logger.warn(
        { permission, workspaceId },
        'Workspace scoped permission does equal current workspace',
      );
      return false;
    }

    // TODO: add in self scope
    if (permission.scope !== 'workspace') {
      throw new AppError(
        'Self scope not implemented',
        ErrorCodes.INTERNAL_MISCONFIGURATION,
      );
    }

    if (
      permission.workspaceId !== workspaceId ||
      permission.type !== type ||
      (permission.action !== action && permission.action !== 'manage')
    ) {
      this.logger.warn(
        { permission, workspaceId, type, action },
        'Permission does not match criteria',
      );
      return false;
    }

    if (!permission.isPattern) {
      const hasPermission = permission.resource === resource;
      this.logger.debug(
        { resource, hasPermission },
        'Determined permission based on resource',
      );

      return hasPermission;
    }

    const parsedGlob = this.parseResourceGlob(permission.resource);

    const numberOfMatches = multimatch(resource, parsedGlob);

    const hasPermission = numberOfMatches.length > 0;

    this.logger.debug(
      { resource, parsedGlob, hasPermission, numberOfMatches },
      'Determined permission based on glob',
    );

    return hasPermission;
  }

  /**
   * Check if the user has permission for all resources
   *
   * @param resources Resources to check for permissions
   * @param type type of permission to check
   * @returns true if the user has permission for all resources
   */
  public async hasPermission(
    resources: string | string[],
    action: PermissionAction,
    type: Permissions = 'db',
    cachedPermissions?: Permission[],
    scope: 'workspace' | 'self' = 'workspace',
  ) {
    // TODO: add 'self' scope
    if (scope !== 'workspace') {
      throw new AppError(
        'Self scope not implemented',
        ErrorCodes.INTERNAL_MISCONFIGURATION,
      );
    }

    let has = false;

    // we need to get the member here and also check the roles?
    const workspaceId = await this.currentWorkspaceId;

    const allResources = Array.isArray(resources) ? resources : [resources];

    try {
      const permissions =
        cachedPermissions ?? (await this.getCurrentPermissions());

      if (
        !permissions ||
        permissions.length === 0 ||
        !Array.isArray(permissions)
      ) {
        this.logger.warn(
          { resources, type, permissions, action },
          'No permissions found for user',
        );
        return false;
      }

      has = allResources.every((resource) =>
        permissions.some((permission) =>
          this.checkPermission(permission, resource, action, type, workspaceId),
        ),
      );
    } catch (error) {
      console.error(error);
      this.logger.error({ error }, 'Error trying to determine permissions');
      // Let's force this to have no permission if we fail to calculate as a fail-safe
      has = false;
    } finally {
      this.logger.info(
        { resources, type, has, allResources, action },
        'Evaluated permissions for resources',
      );

      return has;
    }
  }
}
