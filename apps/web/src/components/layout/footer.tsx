'use client';

import type { IconProps } from '@iconify/react';

import { Icon } from '@iconify/react';
import { Link, Spacer } from '@nextui-org/react';

import { Logo } from '@/components/common/logo';
import { appConfig } from '@/config/app';
import { Navigation } from '@/config/navigation';

type SocialIconProps = Omit<IconProps, 'icon'>;

const navLinks = [
  {
    name: 'Home',
    href: Navigation.HOME,
  },
  // {
  //   name: 'Dashboard',
  //   href: Navigation.DASHBOARD_ROOT,
  // },
  // {
  //   name: 'Billing',
  //   href: Navigation.DASHBOARD_BILLING,
  // },
  {
    name: 'Pricing',
    href: Navigation.PRICING,
  },
];

const socialItems = [
  {
    name: 'Twitter',
    href: appConfig.links.twitter,
    icon: (props: SocialIconProps) => (
      <Icon {...props} icon="fontisto:twitter" />
    ),
  },
  {
    name: 'GitHub',
    href: appConfig.links.github,
    icon: (props: SocialIconProps) => (
      <Icon {...props} icon="fontisto:github" />
    ),
  },
  {
    name: 'Email',
    href: appConfig.links.mailto,
    icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:email" />,
  },
];

export default function Footer() {
  return (
    <footer className="flex w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center">
          <Logo size={44} />
          <span className="text-medium font-medium">{appConfig.name}</span>
        </div>
        <Spacer y={4} />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-500"
              href={item.href}
              size="sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Spacer y={6} />
        <div className="flex justify-center gap-x-4">
          {socialItems.map((item) => (
            <Link
              key={item.name}
              isExternal
              className="text-default-400"
              href={item.href}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="w-5" />
            </Link>
          ))}
        </div>
        <Spacer y={4} />
        <p className="mt-1 text-center text-small text-default-400">
          &copy; {appConfig.creator}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
