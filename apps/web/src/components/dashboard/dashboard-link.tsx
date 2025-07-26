'use client';
import { Button } from '@/components/ui/button';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export function DashboardLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { slug } = useParams<{ slug: string }>();
  return (
    <Link href={dashboardRoute(slug)} className={className}>
      {children}
    </Link>
  );
}

export const DashboardButton = ({
  children,
  className,
  url,
  slug,
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
  slug?: string;
}) => {
  const router = useRouter();
  const clerk = useClerk();

  return (
    <Button
      className={cn(className)}
      onClick={() => {
        if (url) {
          router.push(url);
          return;
        }

        router.push(
          slug
            ? dashboardRoute(slug)
            : clerk.buildSignInUrl({
                redirectUrl: Navigation.DASHBOARD_ROOT,
              }),
        );
      }}
    >
      {children}
    </Button>
  );
};
