'use client';
import { Nav, NavLink } from '@/components/dashboard/nav';
import { Separator } from '@/components/ui/separator';
import {
  Navigation,
  NavigationItem,
  dashboardRoute,
} from '@/config/navigation';
import {
  CableIcon,
  CalendarClock,
  CloudIcon,
  ComponentIcon,
  ContainerIcon,
  CreditCardIcon,
  HomeIcon,
  Settings,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

type BasicNavLink = Pick<NavLink, 'icon' | 'title' | 'href'>;

const HomeNavLinks: BasicNavLink[] = [
  {
    icon: HomeIcon,
    title: 'Home',
    href: Navigation.DASHBOARD_ROOT,
  },
] as const;

export const EnvironmentNavLinks: BasicNavLink[] = [
  {
    icon: CloudIcon,
    title: 'Environment Types',
    href: Navigation.DASHBOARD_ENVIRONMENT_TYPES,
  },
  {
    icon: ContainerIcon,
    title: 'Environments',
    href: Navigation.DASHBOARD_ENVIRONMENTS,
  },
] as const;

export const GeneralNavLinks: BasicNavLink[] = [
  {
    icon: ComponentIcon,
    title: 'Components',
    href: Navigation.DASHBOARD_COMPONENTS,
  },
  {
    icon: CalendarClock,
    title: 'Releases',
    href: Navigation.DASHBOARD_RELEASES,
  },
  {
    icon: CableIcon,
    title: 'Integrations',
    href: Navigation.DASHBOARD_INTEGRATIONS,
  },
  {
    icon: CreditCardIcon,
    title: 'Billing',
    href: Navigation.DASHBOARD_BILLING,
  },
] as const;

export const SettingsNavLinks: BasicNavLink[] = [
  {
    icon: Settings,
    title: 'Settings',
    href: Navigation.DASHBOARD_SETTINGS,
  },
] as const;

export const NavigationItemMappings: Record<
  'home' | 'environment' | 'general' | 'settings',
  { links: BasicNavLink[]; titles?: { sidebar?: string; commandMenu?: string } }
> = {
  home: { links: HomeNavLinks, titles: { commandMenu: 'Home' } },
  environment: {
    links: EnvironmentNavLinks,
    titles: { sidebar: 'Environments', commandMenu: 'Environments' },
  },
  general: { links: GeneralNavLinks, titles: { commandMenu: 'Dashboard' } },
  settings: { links: SettingsNavLinks, titles: { commandMenu: 'Settings' } },
} as const;

export function DashboardLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const { slug } = useParams();
  const rawPath = usePathname();

  const path = `/${rawPath.split('/').slice(2).join('/')}`;

  const getLinkAndVariant = (link: BasicNavLink, exact: boolean): NavLink => {
    const { href } = link;
    return {
      ...link,
      variant: (exact ? path === href : path.startsWith(href))
        ? 'default'
        : 'ghost',
      // TODO: Remove as usage?
      href: dashboardRoute(slug, href as NavigationItem),
    };
  };

  return (
    <>
      {Object.entries(NavigationItemMappings).map(
        ([key, { links, titles }], index) => (
          <>
            <Nav
              key={key}
              title={titles?.sidebar}
              isCollapsed={isCollapsed}
              links={links.map((link) => getLinkAndVariant(link, false))}
            />
            {index < Object.entries(NavigationItemMappings).length - 1 && (
              <Separator />
            )}
          </>
        ),
      )}
    </>
  );
}
