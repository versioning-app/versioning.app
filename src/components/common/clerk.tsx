'use client';

import {
  OrganizationSwitcher,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export const ClerkOrganization = () => {
  const { theme } = useTheme();

  const appearance = {
    baseTheme: theme === 'dark' ? dark : undefined,
  };

  return (
    <div className="pt-2">
      <SignedIn>
        <OrganizationSwitcher
          appearance={appearance}
          organizationProfileProps={{ appearance }}
        />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export const ClerkUser = () => {
  const { theme } = useTheme();

  const appearance = {
    baseTheme: theme === 'dark' ? dark : undefined,
  };

  return (
    <>
      <SignedIn>
        <UserButton appearance={appearance} userProfileProps={{ appearance }} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
