import { Logo } from '@/components/common/logo';
import { MainLayout } from '@/components/dashboard/dashboard';
import { Sidebar } from '@/components/dashboard/sidebar';
import { dashboardRoute, Navigation } from '@/config/navigation';
import { StorageKeys } from '@/config/storage';
import { PermissionsService } from '@/services/permissions.service';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export const dynamic = 'force-dynamic'; // defaults to auto
export const revalidate = 0;

export default async function DashboardLayout({
  children,
  params,
  searchParams,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
  searchParams?: URLSearchParams;
}>) {
  const { slug } = await params;
  const { userId, orgId } = await auth();

  if (!userId) {
    return redirect(Navigation.HOME);
  }

  const workspaceService = await get(WorkspaceService);

  const workspace = await workspaceService.currentWorkspace({
    userId,
    orgId,
  });

  if (!workspace) {
    return redirect(Navigation.HOME);
  }

  if (!slug || slug !== workspace.slug) {
    return redirect(dashboardRoute(workspace.slug));
  }

  const permissionsService = await get(PermissionsService);

  const permissionsUpdated =
    await permissionsService.linkPermissionsToWorkspace(workspace);

  // const returnPath = searchParams?.get('returnPath');
  // if (returnPath) {
  //   return redirect(
  //     dashboardRoute(
  //       workspace.slug,
  //       isNavigationItem(returnPath) ? returnPath : Navigation.DASHBOARD_ROOT,
  //     ),
  //   );
  // }

  if (permissionsUpdated) {
    revalidatePath(dashboardRoute(workspace.slug), 'layout');
    return redirect('?permissionsUpdated=true', RedirectType.replace);
  }

  const layout = (await cookies()).get(
    `${StorageKeys.COOKIE_STORAGE_PREFIX}:layout`,
  );
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const collapsed = (await cookies()).get(
    `${StorageKeys.COOKIE_STORAGE_PREFIX}:collapsed`,
  );
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <ClerkLoading>
        <div>
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-3xl font-semibold text-center text-muted-foreground">
                Loading your dashboard, give us a second...
              </div>
              <Logo className="animate-pulse h-24 w-24" />
            </div>
          </div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <MainLayout>
          <Sidebar
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={4}
          >
            {children}
          </Sidebar>
        </MainLayout>
      </ClerkLoaded>
    </>
  );
}
