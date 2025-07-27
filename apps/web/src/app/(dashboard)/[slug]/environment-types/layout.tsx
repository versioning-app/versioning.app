import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function EnvironmentTypesLayout({
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
      resource="Environment Type"
      href={Navigation.DASHBOARD_ENVIRONMENT_TYPES}
      createHref={Navigation.DASHBOARD_ENVIRONMENT_TYPES_NEW}
    />
  );
}
