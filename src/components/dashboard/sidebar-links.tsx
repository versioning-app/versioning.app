'use client';
import { Nav } from '@/components/dashboard/nav';
import { Separator } from '@/components/ui/separator';
import {
  CalendarClock,
  ComponentIcon,
  Plug2Icon,
  Settings,
} from 'lucide-react';

export function DashboardLinks({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
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
    </>
  );
}
