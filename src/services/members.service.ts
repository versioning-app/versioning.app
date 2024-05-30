import { NewMember, members } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { InferSelectModel } from 'drizzle-orm';
import 'server-only';

export class MembersService extends WorkspaceScopedRepository<typeof members> {
  public constructor() {
    super(members);
  }

  public async create(
    _resource: Omit<NewMember, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof members>> {
    throw new AppError(
      'Unable to create members via service',
      ErrorCodes.STRIPE_UNHANDLED_WEBHOOK_EVENT,
    );
  }
}
