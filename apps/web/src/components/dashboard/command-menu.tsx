'use client';

import { NavigationItemMappings } from '@/components/dashboard/sidebar-links';
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
import {
  Navigation,
  NavigationItem,
  dashboardRoute,
} from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
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
import { Command, LucideIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

export function CommandMenu({ ...props }: AlertDialogProps) {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

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

  function RouterCommandItem({
    href,
    label,
    ...props
  }: {
    href: NavigationItem;
    icon: LucideIcon;
    label: string;
  }) {
    return (
      <CommandItem
        onSelect={() =>
          runCommand(() => router.push(dashboardRoute(slug, href)))
        }
      >
        <props.icon className="mr-2 h-4 w-4" />
        {label}
      </CommandItem>
    );
  }

  return (
    <div ref={commandRoot}>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64',
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
        <CommandList className="text-foreground">
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
          {Object.entries(NavigationItemMappings).map(
            ([key, { links, titles }]) => (
              <div key={key}>
                <CommandGroup heading={titles?.commandMenu}>
                  {links.map((link, index) => (
                    <RouterCommandItem
                      key={index}
                      href={link.href as NavigationItem}
                      icon={link.icon}
                      label={link.title}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </div>
            ),
          )}

          <CommandGroup heading="Theme">
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                )
              }
            >
              <SunMoonIcon className="mr-2 h-4 w-4" />
              Toggle Theme
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light Theme
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark Theme
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System Theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
