import { Button } from '@/components/ui/button';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function EnvironmentsLayout({
  children,
  modal,
  params: { slug },
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      <div>
        <div className="flex">
          <div className="flex-1">
            <Link
              href={dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS)}
            >
              <h1 className="text-2xl">Environments</h1>
            </Link>
          </div>
          <div className="mb-4">
            <Link
              href={dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS_NEW)}
              className="flex items-center"
            >
              <Button className="mr-2">
                <Plus className="w-4 h-4 mr-2" />
                New environment
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col mt-4">{children}</div>
      </div>
      {modal}
    </>
  );
}
