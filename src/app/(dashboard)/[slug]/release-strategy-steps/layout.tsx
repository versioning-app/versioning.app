import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function ReleaseStrategyStepLayout({
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
      resource="Release Strategy Step"
      href={Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS}
      createHref={Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS_NEW}
    />
  );
}
