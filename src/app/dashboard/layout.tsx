import { Logo } from '@/components/common/logo';
import { MainLayout } from '@/components/dashboard/dashboard';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <MainLayout>{children}</MainLayout>
      </ClerkLoaded>
    </>
  );
}
