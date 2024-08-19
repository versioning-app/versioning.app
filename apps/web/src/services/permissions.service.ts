import { revalidate } from '@/app/page';
import { dashboardRoute, Navigation } from '@/config/navigation';
import {
  member_permissions,
  Permission,
  PermissionAction,
  Permissions,
  permissions,
  Role,
  role_permissions,
  Workspace,
} from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { CURRENT_PERMISSIONS_VERSION } from '@/permissions/config';
import { SystemRoles } from '@/permissions/defaults';
import { MembersService } from '@/services/members.service';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { RolesService } from '@/services/roles.service';
import { and, eq, inArray } from 'drizzle-orm';
import multimatch from 'multimatch';
import { revalidatePath } from 'next/cache';
import 'server-only';

export class PermissionsService extends WorkspaceScopedRepository<
  typeof permissions
> {
  private _rolesService: RolesService | undefined;
  private readonly membersService: MembersService;

  public constructor() {
    super(permissions);

    this.membersService = new MembersService();
  }

  /**
   * Gets a role service instance (via getter)
   */
  private get rolesService() {
    if (!this._rolesService) {
      this._rolesService = new RolesService();
    }
    return this._rolesService;
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

    if (permission.workspaceId !== workspaceId) {
      this.logger.warn(
        { permission, workspaceId },
        'Permission does not match current workspace',
      );
      return false;
    }

    if (permission.type !== type) {
      this.logger.warn(
        { permission, workspaceId, type },
        'Permission does not match type',
      );
      return false;
    }

    // if (permission.action !== 'manage' && permission.action !== action) {
    //   this.logger.warn(
    //     { permission, workspaceId, type, action },
    //     'Permission does not match action',
    //   );
    //   return false;
    // }

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

  public async findSystemPermissions() {
    try {
      return this.findAll(eq(permissions.system, true));
    } catch (error) {
      this.logger.warn({ error }, 'No system permissions could be found');
      return [];
    }
  }

  public async create(
    newPermission: Pick<
      Permission,
      'action' | 'resource' | 'scope' | 'isPattern' | 'type'
    >,
  ): Promise<Permission> {
    return super.create(newPermission);
  }

  public async createSystemPermissions(workspace: Workspace) {
    const { permissionsVersion } = workspace;
    const currentPermissionVersion = CURRENT_PERMISSIONS_VERSION;

    if (permissionsVersion === currentPermissionVersion) {
      this.logger.info(
        { permissionsVersion, currentPermissionVersion },
        'Permissions are up to date',
      );
      return;
    }

    // First, let's create the roles
    const systemRoles = await this.rolesService.createSystemRoles(workspace);

    for (const systemRole of systemRoles) {
      // Now, for each role that is not deprecated, let's create the permissions
      const roleConfig = SystemRoles.find(
        (r) =>
          r.name === systemRole.name &&
          (!r.meta.deprecatedIn ||
            r.meta.deprecatedIn > currentPermissionVersion),
      );

      if (!roleConfig) {
        this.logger.warn(
          { systemRole },
          'No role config found for system role as it does not exist or is deprecated',
        );
        continue;
      }

      const newRolePermissions = roleConfig.permissions.filter(
        (permission) =>
          permission.meta.createdIn > permissionsVersion &&
          (!permission.meta.deprecatedIn ||
            permission.meta.deprecatedIn <= permissionsVersion),
      );

      const createdPermissions: Permission[] = [];

      // create the permission entry
      for (const permission of newRolePermissions) {
        this.logger.debug(
          { permission, role: systemRole },
          'Creating system permission',
        );

        createdPermissions.push(
          await this.create({
            action: permission.action,
            resource: permission.isPattern
              ? JSON.stringify(permission.resource)
              : permission.resource[0],
            isPattern: permission.isPattern,
            scope: permission.scope,
            type: permission.type,
          }),
        );

        this.logger.info(
          { permission, role: systemRole },
          'System permission created',
        );
      }

      this.logger.info({ createdPermissions }, 'System permissions created');

      // link the permissions to the role

      for (const permission of createdPermissions) {
        await this.createPermissionForSystemRole(systemRole, permission);
      }

      this.logger.info(
        { role: systemRole, createdPermissions },
        'System permissions linked to role',
      );
    }

    revalidatePath(
      dashboardRoute(workspace.slug, Navigation.DASHBOARD_ROOT),
      'layout',
    );
  }

  public async createPermissionForSystemRole(
    role: Role,
    permission: Permission,
  ) {
    const existing = await this.db
      .select()
      .from(role_permissions)
      .where(
        and(
          eq(role_permissions.roleId, role.id),
          eq(role_permissions.permissionId, permission.id),
        ),
      )
      .execute();

    if (existing.length > 0) {
      this.logger.info(
        { role, permission },
        'System permission already exists for role',
      );
      return true;
    }

    await this.db
      .insert(role_permissions)
      .values({
        roleId: role.id,
        permissionId: permission.id,
      })
      .execute();

    this.logger.info({ role, permission }, 'System permission linked to role');
    return true;
  }
}
