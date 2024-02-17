import { Navigation } from '@/config/navigation';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  let path: string = Navigation.HOME;

  const workspaceService = ServiceFactory.get(WorkspaceService);

  const workspace = await workspaceService.currentWorkspace();

  if (workspace) {
    path = `${Navigation.DASHBOARD_ROOT}/${workspace.slug}`;
  }

  return NextResponse.redirect(`${origin}${path}`);
}
