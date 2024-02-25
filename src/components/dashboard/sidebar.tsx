'use client';
import { DashboardLinks } from '@/components/dashboard/sidebar-links';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StorageKeys } from '@/config/storage';
import { cn } from '@/lib/utils';
import React from 'react';

interface DashboardProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function Sidebar({
  defaultLayout = [180, 440],
  defaultCollapsed,
  navCollapsedSize,
  children,
}: DashboardProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(
    defaultCollapsed ?? false,
  );

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `${
            StorageKeys.COOKIE_STORAGE_PREFIX
          }:layout=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={20}
          maxSize={20}
          onCollapse={() => {
            const value = true;
            setIsCollapsed(value);
            document.cookie = `${
              StorageKeys.COOKIE_STORAGE_PREFIX
            }:collapsed=${JSON.stringify(value)}`;
          }}
          onExpand={() => {
            const value = false;
            setIsCollapsed(value);
            document.cookie = `${
              StorageKeys.COOKIE_STORAGE_PREFIX
            }:collapsed=${JSON.stringify(value)}`;
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out',
            'max-w-[180px]',
            'hidden md:block',
          )}
        >
          <DashboardLinks isCollapsed={isCollapsed} />
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <main className="flex flex-1 flex-col gap-4 p-4 h-full">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
