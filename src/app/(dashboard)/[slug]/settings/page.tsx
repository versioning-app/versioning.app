import { ClerkOrganization, ClerkUser } from '@/components/common/clerk';
import { ChangeSlugForm } from '@/components/dashboard/workspace';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth } from '@clerk/nextjs';
import { Divider } from '@nextui-org/react';

export default async function Settings() {
  const { orgId } = auth();
  const { slug } =
    await ServiceFactory.get(WorkspaceService).currentWorkspace();
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Organization Switcher</h2>
        <ClerkOrganization />
      </div>
      <Divider orientation="horizontal" />

      <div>
        <h2>User Profile</h2>
        <ClerkUser />
      </div>
      <Divider orientation="horizontal" />
      <div>
        <h2>Change Slug</h2>
        <p>Change the slug for your {orgId ? 'organization' : 'user'}</p>
        <ChangeSlugForm />
      </div>
    </div>
  );
}
