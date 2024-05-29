import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function ReleaseLayout({
  children,
  modal,
  params: { slug },
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <DashboardPageLayout
      slug={slug}
      page={children}
      modal={modal}
      resource="Release"
      href={Navigation.DASHBOARD_RELEASES}
      createHref={Navigation.DASHBOARD_RELEASES_NEW}
    />
  );
}
