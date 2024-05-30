import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function MembersLayout({
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
      resource="Members"
      href={Navigation.DASHBOARD_MEMBERS}
    />
  );
}
