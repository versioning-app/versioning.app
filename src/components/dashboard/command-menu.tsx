'use client';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { DialogProps } from '@radix-ui/react-alert-dialog';
import {
  BackpackIcon,
  ExitIcon,
  GearIcon,
  LaptopIcon,
  MoonIcon,
  PersonIcon,
  SlashIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import {
  CalendarClock,
  ComponentIcon,
  HomeIcon,
  Plug2Icon,
  PlusIcon,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const { slug } = useParams();

  const {
    signOut,
    openUserProfile,
    openCreateOrganization,
    openOrganizationProfile,
    organization,
  } = useClerk();

  const commandRoot = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const appearance = {
    baseTheme: resolvedTheme === 'dark' ? dark : undefined,
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div ref={commandRoot}>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <SlashIcon />
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() => runCommand(() => openUserProfile({ appearance }))}
            >
              <PersonIcon className="mr-2 h-4 w-4" />
              Manage Personal Account
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  signOut(() => router.push(Navigation.HOME));
                })
              }
            >
              <ExitIcon className="mr-2 h-4 w-4" />
              Logout
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Organization">
            <CommandItem
              onSelect={() =>
                runCommand(() => openCreateOrganization({ appearance }))
              }
            >
              <BackpackIcon className="mr-2 h-4 w-4" />
              Create Organization
            </CommandItem>
            {organization ? (
              <CommandItem
                onSelect={() =>
                  runCommand(() => {
                    runCommand(() => openOrganizationProfile({ appearance }));
                  })
                }
              >
                <GearIcon className="mr-2 h-4 w-4" />
                Manage Organization
              </CommandItem>
            ) : null}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Dashboard">
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(dashboardRoute(slug, Navigation.DASHBOARD_ROOT))
                )
              }
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Dashboard Home
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS)
                  )
                )
              }
            >
              <ComponentIcon className="mr-2 h-4 w-4" />
              Components
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS_NEW)
                  )
                )
              }
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New Component
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    dashboardRoute(slug, Navigation.DASHBOARD_INTEGRATIONS)
                  )
                )
              }
            >
              <Plug2Icon className="mr-2 h-4 w-4" />
              Integrations
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    dashboardRoute(slug, Navigation.DASHBOARD_RELEASES)
                  )
                )
              }
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              Releases
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    dashboardRoute(slug, Navigation.DASHBOARD_SETTINGS)
                  )
                )
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
