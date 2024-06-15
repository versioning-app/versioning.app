import { Button } from '@/components/ui/button';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ComponentsLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <Link href={dashboardRoute(slug, Navigation.DASHBOARD_SETTINGS)}>
            <h1 className="text-2xl">Settings</h1>
          </Link>
        </div>
      </div>
      <div className="flex flex-col mt-4">{children}</div>
    </div>
  );
}
