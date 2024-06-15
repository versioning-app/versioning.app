import { NewEnvironmentType, environment_types } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { InferSelectModel, eq } from 'drizzle-orm';
import 'server-only';

export class EnvironmentTypesService extends WorkspaceScopedRepository<
  typeof environment_types
> {
  public constructor() {
    super(environment_types);
  }

  public async create(
    resource: Omit<NewEnvironmentType, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof environment_types>> {
    return super.create(resource, eq(environment_types.label, resource.label));
  }
}
