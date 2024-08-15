import { DataList } from '@/components/dashboard/lists/data-list';
import { MembersService } from '@/services/members.service';
import { PermissionsService } from '@/services/permissions.service';
import { get } from '@/services/service-factory';
import { Spacer } from '@nextui-org/react';

export default async function Permissions() {
  const memberService = get(MembersService);

  const components = [];

  components.push(
    <div>
      <h1 className="text-2xl">Current roles</h1>
      <DataList data={await memberService.getCurrentRoles()} />
    </div>,
  );

  const permissionsService = get(PermissionsService);

  const currentPermissions = await permissionsService.getCurrentPermissions();

  components.push(
    <div>
      <h1 className="text-2xl">Current permissions</h1>
      <DataList data={currentPermissions} />
    </div>,
  );

  return (
    <>
      {components.map((c) => (
        <>
          {c}
          <div className="h-1 bg-accent rounded-xl" />
        </>
      ))}
    </>
  );
}
