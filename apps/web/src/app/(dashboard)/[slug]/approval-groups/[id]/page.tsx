import { deleteApprovalGroupAction } from '@/actions/approvals';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ApprovalGroupService } from '@/services/approval-group.service';
import { get } from '@/services/service-factory';

export default async function ComponentVersion({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug } = await params;

  const approvalGroupsService = await get(ApprovalGroupService);
  const approvalGroups = await approvalGroupsService.findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_APPROVAL_GROUPS)}
      resourceName="Approval Group"
      resources={approvalGroups}
      actions={{
        delete: deleteApprovalGroupAction,
      }}
    />
  );
}
