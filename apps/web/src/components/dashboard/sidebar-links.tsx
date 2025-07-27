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
  CombineIcon,
  ComponentIcon,
  ContainerIcon,
  CreditCardIcon,
  GitPullRequest,
  HomeIcon,
  KeySquareIcon,
  LockKeyholeOpen,
  NotepadText,
  RocketIcon,
  Settings,
  SquareCheckBigIcon,
  SquareStackIcon,
  UsersIcon,
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
  {
    icon: RocketIcon,
    title: 'Deployments',
    href: Navigation.DASHBOARD_DEPLOYMENTS,
  },
] as const;

export const ReleaseNavLinks: BasicNavLink[] = [
  {
    icon: CalendarClock,
    title: 'Releases',
    href: Navigation.DASHBOARD_RELEASES,
  },
  {
    icon: CombineIcon,
    title: 'Release Steps',
    href: Navigation.DASHBOARD_RELEASE_STEPS,
  },
  {
    icon: CableIcon,
    title: 'Release Strategies',
    href: Navigation.DASHBOARD_RELEASE_STRATEGIES,
  },
  {
    icon: NotepadText,
    title: 'Release Strategy Steps',
    href: Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS,
  },
  {
    icon: GitPullRequest,
    title: 'Release Components',
    href: Navigation.DASHBOARD_RELEASE_COMPONENTS,
  },
] as const;

export const GeneralNavLinks: BasicNavLink[] = [
  {
    icon: SquareCheckBigIcon,
    title: 'Approval Groups',
    href: Navigation.DASHBOARD_APPROVAL_GROUPS,
  },
  {
    icon: ComponentIcon,
    title: 'Components',
    href: Navigation.DASHBOARD_COMPONENTS,
  },
  {
    icon: SquareStackIcon,
    title: 'Component Versions',
    href: Navigation.DASHBOARD_COMPONENT_VERSIONS,
  },
  // {
  //   icon: CableIcon,
  //   title: 'Integrations',
  //   href: Navigation.DASHBOARD_INTEGRATIONS,
  // },
  {
    icon: UsersIcon,
    title: 'Members',
    href: Navigation.DASHBOARD_MEMBERS,
  },
  {
    icon: CreditCardIcon,
    title: 'Billing',
    href: Navigation.DASHBOARD_BILLING,
  },
] as const;

export const SettingsNavLinks: BasicNavLink[] = [
  {
    icon: KeySquareIcon,
    title: 'Api Keys',
    href: Navigation.DASHBOARD_API_KEYS,
  },
  {
    icon: LockKeyholeOpen,
    title: 'Permissions',
    href: Navigation.DASHBOARD_PERMISSIONS,
  },
  {
    icon: Settings,
    title: 'Settings',
    href: Navigation.DASHBOARD_SETTINGS,
  },
] as const;

export const NavigationItemMappings: Record<
  'home' | 'environment' | 'release' | 'general' | 'settings',
  { links: BasicNavLink[]; titles?: { sidebar?: string; commandMenu?: string } }
> = {
  home: {
    links: HomeNavLinks,
    titles: { sidebar: 'Home', commandMenu: 'Home' },
  },
  environment: {
    links: EnvironmentNavLinks,
    titles: { sidebar: 'Environments', commandMenu: 'Environments' },
  },
  release: {
    links: ReleaseNavLinks,
    titles: { sidebar: 'Releases', commandMenu: 'Releases' },
  },
  general: {
    links: GeneralNavLinks,
    titles: { sidebar: 'Management', commandMenu: 'Management' },
  },
  settings: {
    links: SettingsNavLinks,
    titles: { sidebar: 'Settings', commandMenu: 'Settings' },
  },
} as const;

export function DashboardLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const { slug } = useParams<{ slug: string }>();
  const rawPath = usePathname();

  const path = `/${rawPath.split('/').slice(2).join('/')}`;

  const getLinkAndVariant = (link: BasicNavLink, exact: boolean): NavLink => {
    const { href } = link;

    // TODO: Remove as usage?
    const route = dashboardRoute(slug, href as NavigationItem);

    return {
      ...link,
      variant: (exact ? path === href : path.startsWith(href))
        ? 'default'
        : 'ghost',
      href: route,
    };
  };

  return (
    <div key={slug}>
      {Object.entries(NavigationItemMappings).map(
        ([key, { links, titles }], index) => (
          <>
            <Nav
              key={key}
              title={titles?.sidebar}
              isCollapsed={isCollapsed}
              links={links.map((link) =>
                getLinkAndVariant(
                  link,
                  link.href === Navigation.DASHBOARD_ROOT,
                ),
              )}
            />
            {index < Object.entries(NavigationItemMappings).length - 1 && (
              <Separator />
            )}
          </>
        ),
      )}
    </div>
  );
}
