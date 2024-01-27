import { ClerkOrganization, ClerkUser } from '@/components/common/clerk';
import { Logo } from '@/components/common/logo';
import { CommandMenu } from '@/components/dashboard/command-menu';
import { appConfig } from '@/config/app';
import { Navigation } from '@/config/nav';
import { GearIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export const SidebarHeader = () => (
  <div className="flex h-[60px] items-center border-b px-6">
    <Link
      className="flex items-center gap-2 font-semibold"
      href={Navigation.HOME}
    >
      <Logo className="h-12 w-12" />
      <span className="">{appConfig.name}</span>
    </Link>
  </div>
);

export const SidebarContent = () => (
  <div className="flex-1 overflow-auto py-2 px-4 font-medium">
    <header className="h-50"></header>
    <div className="flex-1">Something</div>
    <footer className="flex-none">
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

export function DashboardComponent() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SidebarHeader />
          <SidebarContent />
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="#">
            <Logo className="min-h-12 min-w-12" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <CommandMenu />
          </div>
          <ClerkOrganization />
          <ClerkUser />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"></main>
      </div>
    </div>
  );
}
