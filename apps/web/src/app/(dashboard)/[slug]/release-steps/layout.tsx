import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function ReleaseStepsLayout({
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
      resource="Release Step"
      href={Navigation.DASHBOARD_RELEASE_STEPS}
      createHref={Navigation.DASHBOARD_RELEASE_STEPS_NEW}
    />
  );
}
