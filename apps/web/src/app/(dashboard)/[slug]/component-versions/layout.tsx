import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function ComponentVersions({
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
      resource="Component Version"
      href={Navigation.DASHBOARD_COMPONENT_VERSIONS}
      createHref={Navigation.DASHBOARD_COMPONENT_VERSIONS_NEW}
    />
  );
}
