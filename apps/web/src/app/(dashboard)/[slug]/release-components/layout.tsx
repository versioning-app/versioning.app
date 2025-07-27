import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function ReleaseComponentsLayout({
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
      resource="Release Component"
      href={Navigation.DASHBOARD_RELEASE_COMPONENTS}
      createHref={Navigation.DASHBOARD_RELEASE_COMPONENTS_NEW}
    />
  );
}
