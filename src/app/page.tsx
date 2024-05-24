import { Navigation } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'; // defaults to auto
export const revalidate = 0;

export default async function RootPage() {
  const logger = serverLogger({ name: 'index' });

  const workspaceService = ServiceFactory.get(WorkspaceService);

  const { userId, orgId, sessionClaims } = auth();

  let path: string = Navigation.HOME;

  if (userId || orgId) {
    try {
      const { workspace } = await workspaceService.ensureWorkspace({
        userId,
        orgId,
        sessionClaims,
      });

      if (workspace) {
        path = `${Navigation.DASHBOARD_ROOT}${workspace.slug}`;
      }
    } catch (error) {
      logger.debug(
        { error },
        'Error getting current workspace, user is likely not logged in',
      );
    }
  }

  return redirect(path);
}
