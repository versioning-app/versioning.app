import { Navigation } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const logger = serverLogger({ source: 'index' });

  let path: string = Navigation.HOME;

  const workspaceService = ServiceFactory.get(WorkspaceService);

  const { userId, orgId, sessionClaims } = getAuth(request);

  if (userId || orgId) {
    try {
      const { workspace } = await workspaceService.ensureWorkspace({
        userId,
        orgId,
        sessionClaims,
      });

      if (workspace) {
        path = `${Navigation.DASHBOARD_ROOT}/${workspace.slug}`;
      }
    } catch (error) {
      logger.debug(
        { error },
        'Error getting current workspace, user is likely not logged in'
      );
    }
  }

  return NextResponse.redirect(`${origin}${path}`);
}
