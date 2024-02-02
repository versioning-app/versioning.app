'use client';

import { Navigation } from '@/config/nav';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export const ClerkOrganization = () => {
  const { resolvedTheme } = useTheme();

  const appearance = {
    baseTheme: resolvedTheme === 'dark' ? dark : undefined,
  };

  return (
    <div className="pt-2">
      <OrganizationSwitcher
        appearance={appearance}
        organizationProfileProps={{ appearance }}
      />
    </div>
  );
};

export const ClerkUser = () => {
  const { resolvedTheme } = useTheme();

  const appearance = {
    baseTheme: resolvedTheme === 'dark' ? dark : undefined,
  };

  return (
    <>
      <UserButton
        appearance={appearance}
        userProfileProps={{ appearance }}
        afterSignOutUrl={Navigation.HOME}
      />
    </>
  );
};
