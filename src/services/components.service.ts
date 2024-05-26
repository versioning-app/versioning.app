import { NewComponent, components } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { InferSelectModel, eq } from 'drizzle-orm';
import 'server-only';

export class ComponentsService extends WorkspaceScopedRepository<
  typeof components
> {
  public constructor() {
    super(components);
  }

  public async hasDependents(_id: string): Promise<boolean> {
    return false;
  }

  public async create(
    resource: Omit<NewComponent, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof components>> {
    const existing = await this.findAllBy(eq(components.name, resource.name));

    if (existing?.length > 0) {
      throw new AppError(
        'A component with the same name already exists',
        ErrorCodes.RESOURCE_ALREADY_EXISTS,
      );
    }

    return super.create(resource);
  }
}
