import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function EnvironmentTypesLayout({
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
      resource="Environment Type"
      href={Navigation.DASHBOARD_ENVIRONMENT_TYPES}
      createHref={Navigation.DASHBOARD_ENVIRONMENT_TYPES_NEW}
    />
  );
}
