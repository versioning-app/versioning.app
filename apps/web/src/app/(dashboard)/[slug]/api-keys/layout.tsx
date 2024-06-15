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
      resource="Api Key"
      href={Navigation.DASHBOARD_API_KEYS}
      createHref={Navigation.DASHBOARD_API_KEYS_NEW}
    />
  );
}
