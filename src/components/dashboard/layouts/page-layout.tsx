import { Button } from '@/components/ui/button';
import {
  Navigation,
  NavigationItem,
  dashboardRoute,
} from '@/config/navigation';
import { pluralize } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPageLayout({
  page,
  modal,
  resource,
  slug,
  href,
  createHref,
}: {
  page: React.ReactNode;
  modal: React.ReactNode;
  slug: string;
  resource: string;
  href: NavigationItem;
  createHref?: NavigationItem;
}) {
  return (
    <>
      <div className="h-full">
        <div className="flex">
          <div className="flex-1">
            <Link href={dashboardRoute(slug, href)}>
              <h1 className="text-2xl">{pluralize(resource)}</h1>
            </Link>
          </div>
          {createHref ? (
            <div className="mb-4">
              <Link
                href={dashboardRoute(slug, createHref)}
                className="flex items-center"
              >
                <Button className="mr-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Create {resource}
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col mt-4 h-full">{page}</div>
      </div>
      {modal}
    </>
  );
}
