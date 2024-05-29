import { db } from '@/database/db';
import { NewComponentVersion, component_versions } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { ComponentsService } from '@/services/components.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { get } from '@/services/service-factory';
import { InferSelectModel, eq, inArray } from 'drizzle-orm';
import 'server-only';

export class ComponentVersionService extends CrudRepository<
  typeof component_versions,
  'id'
> {
  private componentService: ComponentsService;

  public constructor() {
    super(db, component_versions, 'id');

    this.componentService = get(ComponentsService);
  }

  public async findAll() {
    this.logger.debug('Finding all component versions');

    const componentVersions = await this.componentService.findAll();

    return this.findAllBy(
      inArray(
        component_versions.componentId,
        componentVersions.map((c) => c.id),
      ),
    );
  }

  public async findAllByComponentId(
    componentId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof component_versions>[]> {
    const component = await this.componentService.findOne(componentId);

    if (!component) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(
      eq(component_versions.componentId, componentId),
      limits,
    );
  }

  public async create(
    resource: Omit<NewComponentVersion, 'workspaceId'>,
  ): Promise<InferSelectModel<typeof component_versions>> {
    return super.create(
      resource,
      eq(component_versions.version, resource.version),
    );
  }
}
