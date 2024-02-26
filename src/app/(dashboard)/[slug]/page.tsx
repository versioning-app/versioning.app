import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth } from '@clerk/nextjs';

export const revalidate = 0;

export default async function Dashboard() {
  const { orgId, sessionClaims } = auth();

  const workspaceId =
    await ServiceFactory.get(WorkspaceService).currentWorkspaceId();

  return (
    <div>
      <h1 className="text-2xl">Home</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to{' '}
        {orgId
          ? `the dashboard for ${sessionClaims?.orgName}`
          : 'your dashboard'}
        {`, ${sessionClaims?.firstName}`}
      </p>
      <div className="grid grid-col-6"></div>
    </div>
  );
}
