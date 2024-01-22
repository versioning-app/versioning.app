import { buttonVariants } from '@/components/ui/button';
import { CommandMenu } from '@/components/ui/command-menu';
import { MainNav } from '@/components/ui/main-nav';
import { MobileNav } from '@/components/ui/mobile-nav';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { appConfig } from '@/config/app';
import { cn } from '@/lib/utils';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            <Link
              href={appConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <TwitterLogoIcon className="h-4 w-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
