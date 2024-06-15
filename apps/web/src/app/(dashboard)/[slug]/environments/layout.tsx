import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function EnvironmentLayout({
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
      resource="Environment"
      href={Navigation.DASHBOARD_ENVIRONMENTS}
      createHref={Navigation.DASHBOARD_ENVIRONMENTS_NEW}
    />
  );
}
