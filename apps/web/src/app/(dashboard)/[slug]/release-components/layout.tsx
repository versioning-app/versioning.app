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
      resource="Release Component"
      href={Navigation.DASHBOARD_RELEASE_COMPONENTS}
      createHref={Navigation.DASHBOARD_RELEASE_COMPONENTS_NEW}
    />
  );
}
