import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function ReleaseStrategyStepLayout({
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
      resource="Deployment"
      href={Navigation.DASHBOARD_DEPLOYMENTS}
      createHref={Navigation.DASHBOARD_DEPLOYMENTS_NEW}
    />
  );
}
