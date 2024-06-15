import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default function ApprovalGroupsLayout({
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
      resource="Approval Group"
      href={Navigation.DASHBOARD_APPROVAL_GROUPS}
      createHref={Navigation.DASHBOARD_APPROVAL_GROUPS_NEW}
    />
  );
}
