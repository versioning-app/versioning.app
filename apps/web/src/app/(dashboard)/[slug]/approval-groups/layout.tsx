import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';

export default async function ApprovalGroupsLayout({
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
      resource="Approval Group"
      href={Navigation.DASHBOARD_APPROVAL_GROUPS}
      createHref={Navigation.DASHBOARD_APPROVAL_GROUPS_NEW}
    />
  );
}
