'use client';
import { Logo } from '@/components/common/logo';
import { DashboardLinks } from '@/components/dashboard/sidebar-links';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { appConfig } from '@/config/app';
import { Navigation } from '@/config/nav';
import Link from 'next/link';
import React from 'react';

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 mt-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Logo className="min-h-5 min-w-5" />

          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="px-0 bg-gray-100/90 py-4 dark:bg-gray-800/90"
      >
        <Link href={Navigation.DASHBOARD} className="pl-4 flex items-center">
          <Logo className="min-h-5 min-w-5" />
          <span className="font-bold">{appConfig.name}</span>
        </Link>
        {/* <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6"> */}
        <DashboardLinks isCollapsed={false} />
        {/* </ScrollArea> */}
      </SheetContent>
    </Sheet>
  );
}
