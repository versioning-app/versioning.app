'use client';
import { Nav, NavLink } from '@/components/dashboard/nav';
import { Separator } from '@/components/ui/separator';
import { Navigation } from '@/config/nav';
import {
  CalendarClock,
  ComponentIcon,
  Plug2Icon,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function DashboardLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const path = usePathname();

  const getLinkAndVariant = (
    href: string
  ): Pick<NavLink, 'variant' | 'href'> => {
    return {
      variant: path.startsWith(href) ? 'default' : 'ghost',
      href,
    };
  };

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: 'Components',
            icon: ComponentIcon,
            ...getLinkAndVariant(Navigation.DASHBOARD_COMPONENTS),
          },
          {
            title: 'Releases',
            icon: CalendarClock,
            ...getLinkAndVariant(Navigation.DASHBOARD_RELEASES),
          },
          {
            title: 'Integrations',
            icon: Plug2Icon,
            ...getLinkAndVariant(Navigation.DASHBOARD_INTEGRATIONS),
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
            ...getLinkAndVariant(Navigation.DASHBOARD_SETTINGS),
          },
        ]}
      />
    </>
  );
}
