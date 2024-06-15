import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function ComponentsLayout({
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
      resource="Component"
      href={Navigation.DASHBOARD_COMPONENTS}
      createHref={Navigation.DASHBOARD_COMPONENTS_NEW}
    />
  );
}
