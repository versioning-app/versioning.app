import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function ReleaseLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
