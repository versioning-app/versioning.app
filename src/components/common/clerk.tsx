'use client';

import { Navigation } from '@/config/navigation';
import { revalidateUrl } from '@/lib/utils';
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
        afterCreateOrganizationUrl={revalidateUrl(Navigation.DASHBOARD)}
        afterLeaveOrganizationUrl={Navigation.HOME}
        afterSelectOrganizationUrl={revalidateUrl(Navigation.DASHBOARD)}
        afterSelectPersonalUrl={revalidateUrl(Navigation.DASHBOARD)}
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
        afterMultiSessionSingleSignOutUrl={Navigation.HOME}
        afterSignOutUrl={Navigation.HOME}
        afterSwitchSessionUrl={revalidateUrl(Navigation.DASHBOARD)}
      />
    </>
  );
};
