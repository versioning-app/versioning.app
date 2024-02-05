import { Button } from '@/components/ui/button';
import { Navigation } from '@/config/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <Link href={Navigation.DASHBOARD_COMPONENTS}>
            <h1 className="text-2xl">Components</h1>
          </Link>
        </div>
        <div className="mb-4">
          <Link
            href={Navigation.DASHBOARD_COMPONENTS_NEW}
            className="flex items-center"
          >
            <Button className="mr-2">
              <Plus className="w-4 h-4 mr-2" />
              New component
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col mt-4">{children}</div>
    </div>
  );
}
