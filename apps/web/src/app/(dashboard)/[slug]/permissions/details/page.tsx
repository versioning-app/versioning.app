import { DataList } from '@/components/dashboard/lists/data-list';
import { PermissionAction } from '@/database/schema';
import { MembersService } from '@/services/members.service';
import { PermissionsService } from '@/services/permissions.service';
import { get } from '@/services/service-factory';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default async function PermissionDetails() {
  const memberService = await get(MembersService);
  const permissionsService = await get(PermissionsService);

  const member = await memberService.currentMember;
  const roles = await memberService.getCurrentRoles();
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
      currentPermissions,
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

  const results = await Promise.all(permsToCheck);

  return (
    <div className="w-full">
      <Card className="bg-background border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Permission Details
          </CardTitle>
          <CardDescription>
            Comprehensive overview of your current permissions, roles, and
            access rights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                Permissions Check
              </AccordionTrigger>
              <AccordionContent>
                <DataList data={results} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                Current Permissions
              </AccordionTrigger>
              <AccordionContent>
                <DataList data={currentPermissions} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                Current Roles
              </AccordionTrigger>
              <AccordionContent>
                <DataList data={roles} />
              </AccordionContent>
            </AccordionItem>
            {memberPermissions?.length > 0 && (
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium">
                  Member Permissions
                </AccordionTrigger>
                <AccordionContent>
                  <DataList data={memberPermissions} />
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                Role Permissions
              </AccordionTrigger>
              <AccordionContent>
                <DataList data={rolePermissions} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
