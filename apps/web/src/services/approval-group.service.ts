import { NewApprovalGroup, approval_groups } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { InferSelectModel, eq } from 'drizzle-orm';
import 'server-only';

export class ApprovalGroupService extends WorkspaceScopedRepository<
  typeof approval_groups
> {
  public constructor() {
    super(approval_groups);
  }

  public async create(
    resource: Omit<NewApprovalGroup, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof approval_groups>> {
    return super.create(resource, eq(approval_groups.name, resource.name));
  }
}
