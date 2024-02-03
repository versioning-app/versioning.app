import { Navigation } from '@/config/nav';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth, clerkClient } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const getOrganization = async (organizationId: string | null | undefined) => {
  if (!organizationId) {
    return undefined;
  }

  return await clerkClient.organizations.getOrganization({
    organizationId,
  });
};

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect(Navigation.HOME);
  }

  const workspace = await ServiceFactory.get(
    WorkspaceService
  ).currentWorkspace();

  return (
    <div>
      <p>Welcome to your dashboard</p>
      {/* {organization && <p>You are a member of {organization.name}</p>} */}
      {workspace && <pre>{JSON.stringify(workspace, null, 2)}</pre>}
    </div>
  );
}
