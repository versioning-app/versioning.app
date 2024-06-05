import {
  ApprovalGroup,
  NewApprovalGroup,
  approval_groups,
} from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { eq } from 'drizzle-orm';
import 'server-only';

export class ApprovalGroupsService extends WorkspaceScopedRepository<
  typeof approval_groups
> {
  public constructor() {
    super(approval_groups);
  }

  public async create(
    newApprovalGroup: Pick<NewApprovalGroup, 'description' | 'name'>,
  ): Promise<ApprovalGroup> {
    return super.create(
      newApprovalGroup,
      eq(approval_groups.name, newApprovalGroup.name),
    );
  }
}
