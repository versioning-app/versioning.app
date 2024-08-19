import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function PermissionsLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <DashboardPageLayout
      slug={slug}
      page={children}
      resource="Permissions"
      href={Navigation.DASHBOARD_PERMISSIONS}
    />
  );
}
