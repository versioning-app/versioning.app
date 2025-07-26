'use server';

import { PermissionAction, Permissions } from '@/database/schema';
import { DatabaseService } from '@/services/database.service';
import { MembersService } from '@/services/members.service';
import { PermissionsService } from '@/services/permissions.service';
import { RolesService } from '@/services/roles.service';
import { get } from '@/services/service-factory';
import { inArray } from 'drizzle-orm';

export async function evaluatePermission(
  resource: string,
  actions: PermissionAction[],
  types: Permissions[],
  roleIds: string[],
) {
  const permissionsService = await get(PermissionsService);
  const rolesService = await get(RolesService);
  const membersService = await get(MembersService);

  let permissions;

  if (roleIds.length === 0) {
    // Use current user's roles if no roles are selected
    const currentMember = await membersService.currentMember();
    const currentRoles = await membersService.getCurrentRoles(currentMember);
    permissions = await permissionsService.getCurrentPermissions();
  } else {
    const roles = await rolesService.findAllBy(
      inArray(rolesService.schema.id, roleIds),
    );
    const allPermissions = await permissionsService.findAll();
    permissions = await permissionsService.getPermissionsForRoles(
      roles.map((role) => role.id),
      allPermissions,
    );
  }

  const results = await Promise.all(
    actions.flatMap((action) =>
      types.map((type) =>
        permissionsService.hasPermission([resource], action, type, permissions),
      ),
    ),
  );
  return results.every((result) => result === true);
}

export async function fetchRoles() {
  const rolesService = await get(RolesService);
  const roles = await rolesService.findAll();
  return roles.map((role) => ({ id: role.id, name: role.name }));
}

export async function fetchAvailableResources() {
  const databaseService = await get(DatabaseService);

  const tables = databaseService
    .getTables()
    .filter((table) => table !== 'leads');

  return {
    tables,
  };
}
