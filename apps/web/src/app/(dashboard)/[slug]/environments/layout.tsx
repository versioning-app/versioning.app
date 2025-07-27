import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function EnvironmentLayout({
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
      resource="Environment"
      href={Navigation.DASHBOARD_ENVIRONMENTS}
      createHref={Navigation.DASHBOARD_ENVIRONMENTS_NEW}
    />
  );
}
