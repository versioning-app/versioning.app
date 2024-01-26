'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { appConfig } from '@/config/app';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {appConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/pricing"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/pricing' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Pricing
        </Link>
        <Link
          href={appConfig.links.github}
          className={cn(
            'hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block'
          )}
        >
          GitHub
        </Link>
      </nav>
    </div>
  );
}
