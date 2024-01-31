'use client';
import { Nav } from '@/components/dashboard/nav';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Storage } from '@/config/storage';
import { cn } from '@/lib/utils';
import {
  CalendarClock,
  ComponentIcon,
  Plug2Icon,
  Settings,
} from 'lucide-react';
import React from 'react';

interface DashboardProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function Sidebar({
  defaultLayout = [265, 440, 655],
  defaultCollapsed,
  navCollapsedSize,
  children,
}: DashboardProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(
    defaultCollapsed ?? false
  );

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `${
            Storage.COOKIE_STORAGE_PREFIX
          }:layout=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            const value = true;
            setIsCollapsed(value);
            document.cookie = `${
              Storage.COOKIE_STORAGE_PREFIX
            }:collapsed=${JSON.stringify(value)}`;
          }}
          onExpand={() => {
            const value = false;
            setIsCollapsed(value);
            document.cookie = `${
              Storage.COOKIE_STORAGE_PREFIX
            }:collapsed=${JSON.stringify(value)}`;
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out '
          )}
        >
          {/* <div
            className={cn(
              'flex h-14 lg:h-[60px] items-center justify-center',
              isCollapsed ? 'h-14 lg:h-[60px]' : 'px-2'
            )}
          >
            <Link href={Navigation.DASHBOARD}>
              <Logo className="w-10 h-10 md:w-12 md:h-12" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </div>
          <Separator /> */}
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Components',
                icon: ComponentIcon,
                variant: 'ghost',
              },
              {
                title: 'Releases',
                icon: CalendarClock,
                variant: 'ghost',
              },
              {
                title: 'Integrations',
                icon: Plug2Icon,
                variant: 'ghost',
              },
              // {
              //   title: 'Drafts',
              //   label: '9',
              //   icon: File,
              //   variant: 'ghost',
              // },
              // {
              //   title: 'Sent',
              //   label: '',
              //   icon: Send,
              //   variant: 'ghost',
              // },
              // {
              //   title: 'Junk',
              //   label: '23',
              //   icon: ArchiveX,
              //   variant: 'ghost',
              // },
              // {
              //   title: 'Trash',
              //   label: '',
              //   icon: Trash2,
              //   variant: 'ghost',
              // },
              // {
              //   title: 'Archive',
              //   label: '',
              //   icon: Archive,
              //   variant: 'ghost',
              // },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'Settings',
                icon: Settings,
                variant: 'ghost',
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
