import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function ComponentVersionsLayout({
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
      resource="Component Version"
      href={Navigation.DASHBOARD_COMPONENT_VERSIONS}
      createHref={Navigation.DASHBOARD_COMPONENT_VERSIONS_NEW}
    />
  );
}
