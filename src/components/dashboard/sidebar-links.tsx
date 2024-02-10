'use client';
import { Nav, NavLink } from '@/components/dashboard/nav';
import { Separator } from '@/components/ui/separator';
import { Navigation } from '@/config/navigation';
import {
  CalendarClock,
  ComponentIcon,
  CreditCardIcon,
  HomeIcon,
  Plug2Icon,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function DashboardLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const path = usePathname();

  const getLinkAndVariant = (
    href: string,
    exact = false
  ): Pick<NavLink, 'variant' | 'href'> => {
    return {
      variant: (exact ? path === href : path.startsWith(href))
        ? 'default'
        : 'ghost',
      href,
    };
  };

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: 'Home',
            icon: HomeIcon,
            ...getLinkAndVariant(Navigation.DASHBOARD, true),
          },
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
          {
            title: 'Billing',
            icon: CreditCardIcon,
            ...getLinkAndVariant(Navigation.DASHBOARD_BILLING),
          }
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
