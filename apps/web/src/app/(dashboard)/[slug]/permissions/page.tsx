import { DataList } from '@/components/dashboard/lists/data-list';
import { members, PermissionAction } from '@/database/schema';
import { MembersService } from '@/services/members.service';
import { PermissionsService } from '@/services/permissions.service';
import { get } from '@/services/service-factory';

export default async function Permissions() {
  const memberService = get(MembersService);

  const components = [];

  const member = await memberService.currentMember;

  const roles = await memberService.getCurrentRoles();

  const permissionsService = get(PermissionsService);

  const allPermissions = await permissionsService.findAll();

  const currentPermissions = await permissionsService.getCurrentPermissions();

  const memberPermissions = await permissionsService.getPermissionsForMembers(
    [member.id],
    allPermissions,
  );

  const rolePermissions = await permissionsService.getPermissionsForRoles(
    roles.map((r) => r.id),
    allPermissions,
  );

  const buildCheck = async ({
    resource,
    action,
    scope = 'workspace',
  }: {
    resource: string;
    action: PermissionAction;
    scope?: 'workspace' | 'self';
  }) => {
    const hasPermission = await permissionsService.hasPermission(
      [resource],
      action,
      'db',
      allPermissions,
      scope,
    );

    return {
      resource,
      action,
      scope,
      hasPermission,
    };
  };

  const permsToCheck = [
    buildCheck({ resource: 'leads', action: 'manage' }),
    buildCheck({ resource: 'workspaces', action: 'manage' }),
    buildCheck({ resource: 'releases', action: 'read' }),
    buildCheck({ resource: 'releases', action: 'create' }),
    buildCheck({ resource: 'releases', action: 'update' }),
    buildCheck({ resource: 'releases', action: 'delete' }),
    buildCheck({ resource: 'releases', action: 'manage' }),
    buildCheck({ resource: 'members', action: 'manage' }),
    buildCheck({ resource: 'admin', action: 'manage' }),
    buildCheck({ resource: 'releases', action: 'manage' }),
    buildCheck({ resource: 'components', action: 'manage' }),
    buildCheck({ resource: 'release_steps', action: 'manage' }),
    buildCheck({ resource: 'release_strategy_steps', action: 'manage' }),
    buildCheck({ resource: 'release_components', action: 'manage' }),
    buildCheck({ resource: 'environments', action: 'manage' }),
    buildCheck({ resource: 'environment_types', action: 'manage' }),
    buildCheck({ resource: 'approvals', action: 'manage' }),
    buildCheck({ resource: 'deployments', action: 'manage' }),
    buildCheck({ resource: 'component_versions', action: 'manage' }),
  ];

  const results = (await Promise.all(permsToCheck)).flat();

  components.push(
    <div>
      <h1 className="text-2xl">Permissions check</h1>
      <DataList data={results} />
    </div>,
  );

  components.push(
    <div>
      <h1 className="text-2xl">Current permissions</h1>
      <DataList data={currentPermissions} />
    </div>,
  );

  components.push(
    <div>
      <h1 className="text-2xl">Current roles</h1>
      <DataList data={roles} />
    </div>,
  );

  if (memberPermissions?.length) {
    components.push(
      <div>
        <h1 className="text-2xl">Member permissions</h1>
        <DataList data={memberPermissions} />
      </div>,
    );
  }

  components.push(
    <div>
      <h1 className="text-2xl">Role permissions</h1>
      <DataList data={rolePermissions} />
    </div>,
  );
  return (
    <div className="p-2">
      {components.map((c, index) => (
        <div key={index} className="fle">
          {c}
          <div className="h-1 bg-accent rounded-xl" />
        </div>
      ))}
    </div>
  );
}
