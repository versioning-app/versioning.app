import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function ReleaseStrategyLayout({
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
      resource="Release Strategy"
      href={Navigation.DASHBOARD_RELEASE_STRATEGIES}
      createHref={Navigation.DASHBOARD_RELEASE_STRATEGIES_NEW}
    />
  );
}
