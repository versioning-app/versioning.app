import { Button } from '@/components/ui/button';
import { NavigationItem, dashboardRoute } from '@/config/navigation';
import Link from 'next/link';

export const RequiresDependencies = ({
  resource,
  slug,
  dependency,
  href,
}: {
  slug: string;
  resource: string;
  dependency: string;
  href: NavigationItem;
}) => {
  return (
    <div>
      <h1 className="text-2xl mb-2">No {dependency} found</h1>
      <p className="mb-4">
        You need to have at least one {resource} before you can create a{' '}
        {dependency}
      </p>
      <Link href={dashboardRoute(slug, href)}>
        <Button>Create {dependency}</Button>
      </Link>
    </div>
  );
};
