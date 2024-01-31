import { Logo } from '@/components/common/logo';
import { MainLayout } from '@/components/dashboard/dashboard';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Storage } from '@/config/storage';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { cookies } from 'next/headers';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layout = cookies().get(`${Storage.COOKIE_STORAGE_PREFIX}:layout`);
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const collapsed = cookies().get(`${Storage.COOKIE_STORAGE_PREFIX}:collapsed`);
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
