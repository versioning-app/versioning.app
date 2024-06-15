import { NewComponent, components } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { InferSelectModel, eq } from 'drizzle-orm';
import 'server-only';

export class ComponentsService extends WorkspaceScopedRepository<
  typeof components
> {
  public constructor() {
    super(components);
  }

  public async create(
    resource: Omit<NewComponent, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof components>> {
    return super.create(resource, eq(components.name, resource.name));
  }
}
