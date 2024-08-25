import { ClerkOrganization, ClerkUser } from '@/components/common/clerk';
import { Logo } from '@/components/common/logo';
import { CommandMenu } from '@/components/dashboard/command-menu';
import { DashboardLink } from '@/components/dashboard/dashboard-link';
import { MobileSidebar } from '@/components/dashboard/mobile-sidebar';
import { Separator } from '@/components/ui/separator';
import { appConfig } from '@/config/app';
import { GearIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export const SidebarHeader = () => (
  <div className="flex h-[60px] items-center border-b px-6">
    <DashboardLink className="flex items-center gap-2 font-semibold">
      <Logo className="h-12 w-12" />
      <span className="">{appConfig.name}</span>
    </DashboardLink>
  </div>
);

export const SidebarContent = () => (
  <div className="flex-1 overflow-auto py-2 px-4 font-medium">
    <header className="h-50 flex-none"></header>
    <div className="grow">
      <p>test</p>
    </div>
    <footer className="h-50 flex-none">
      <Link
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        href="#"
      >
        <GearIcon className="h-4 w-4" />
        Settings
      </Link>
    </footer>
  </div>
);

export function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 bg-gray-100/40 px-4 dark:bg-gray-800/40">
          <DashboardLink>
            <MobileSidebar />
            <Logo className="hidden md:inline" />
            <span className="sr-only">Dashboard</span>
            <span className="hidden">{appConfig.name}</span>
          </DashboardLink>
          <div className="w-full flex-1">
            <CommandMenu />
          </div>
          <ClerkOrganization />
          <ClerkUser />
        </header>
        <Separator />
        {<div className="w-full h-full">{children}</div>}
      </div>
    </div>
  );
}
