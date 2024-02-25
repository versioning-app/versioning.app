import { Button } from '@/components/ui/button';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function EnvironmentTypesLayout({
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
      <div className="h-full">
        <div className="flex">
          <div className="flex-1">
            <Link
              href={dashboardRoute(
                slug,
                Navigation.DASHBOARD_ENVIRONMENT_TYPES,
              )}
            >
              <h1 className="text-2xl">Environment Types</h1>
            </Link>
          </div>
          <div className="mb-4">
            <Link
              href={dashboardRoute(
                slug,
                Navigation.DASHBOARD_ENVIRONMENT_TYPES_NEW,
              )}
              className="flex items-center"
            >
              <Button className="mr-2">
                <Plus className="w-4 h-4 mr-2" />
                New environment type
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col mt-4 h-full">{children}</div>
      </div>
      {modal}
    </>
  );
}
