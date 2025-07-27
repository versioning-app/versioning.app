import { Navigation, dashboardRoute } from '@/config/navigation';
import Link from 'next/link';

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
