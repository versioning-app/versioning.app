import { Navigation } from '@/config/navigation';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string } & {
    revalidate?: string;
    ts?: string;
  };
}) {
  const { sessionClaims } = auth();

  if (searchParams?.revalidate === 'true') {
    revalidatePath(Navigation.DASHBOARD);
    return redirect(Navigation.DASHBOARD);
  }

  const workspaceId = await ServiceFactory.get(
    WorkspaceService
  ).currentWorkspaceId();

  return (
    <div>
      <p>Welcome to your dashboard</p>
      {/* {organization && <p>You are a member of {organization.name}</p>} */}
      {sessionClaims && <pre>{JSON.stringify(sessionClaims, null, 2)}</pre>}
      {workspaceId && <p>Your workspace ID is {workspaceId}</p>}
      {/* {!workspaceId && <UserReload />} */}
    </div>
  );
}
