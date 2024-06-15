'use client';
import { createApprovalGroupAction } from '@/actions/approvals';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { createApprovalGroupSchema } from '@/validation/approvals';

export function CreateApprovalGroup() {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_APPROVAL_GROUPS}
      resource="Approval Group"
      schema={createApprovalGroupSchema}
      action={createApprovalGroupAction}
    />
  );
}
