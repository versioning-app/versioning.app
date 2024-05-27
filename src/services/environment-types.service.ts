import { NewEnvironmentType, environmentTypes } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { InferSelectModel, eq } from 'drizzle-orm';
import 'server-only';

export class EnvironmentTypesService extends WorkspaceScopedRepository<
  typeof environmentTypes
> {
  public constructor() {
    super(environmentTypes);
  }

  public async create(
    resource: Omit<NewEnvironmentType, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof environmentTypes>> {
    return super.create(resource, eq(environmentTypes.label, resource.label));
  }
}
