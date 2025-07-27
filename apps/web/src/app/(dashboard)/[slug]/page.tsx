import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth } from '@clerk/nextjs/server';

export const revalidate = 0;

export default async function Dashboard() {
  const { orgId, sessionClaims } = await auth();

  const workspaceService = await get(WorkspaceService);
  const workspaceId = await workspaceService.currentWorkspaceId();

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
      <div className="grid grid-col-6">
        <div className="col-span-6 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Current Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{workspaceId}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
