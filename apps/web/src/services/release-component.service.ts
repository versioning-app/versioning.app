import { db } from '@/database/db';
import {
  NewReleaseComponentVersion,
  release_components,
} from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { ComponentVersionService } from '@/services/component-version.service';
import { ReleaseService } from '@/services/release.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { get } from '@/services/service-factory';
import { InferSelectModel, eq, inArray } from 'drizzle-orm';
import 'server-only';

export class ReleaseComponentService extends CrudRepository<
  typeof release_components
> {
  private releaseService: ReleaseService;
  private componentVersionService: ComponentVersionService;

  public constructor() {
    super(db, release_components, 'id');

    this.releaseService = get(ReleaseService);
    this.componentVersionService = get(ComponentVersionService);
  }

  public async findAll() {
    this.logger.debug('Finding all release components');

    const releases = await this.releaseService.findAll();

    return this.findAllBy(
      inArray(
        release_components.releaseId,
        releases.map((c) => c.id),
      ),
    );
  }

  public async findAllByReleaseId(
    releaseId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof release_components>[]> {
    const release = await this.releaseService.findOne(releaseId);

    if (!release) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(eq(release_components.releaseId, releaseId), limits);
  }

  public async findAllByComponentVersionId(
    componentVersionId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof release_components>[]> {
    const componentVersion =
      await this.componentVersionService.findOne(componentVersionId);

    if (!componentVersion) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(
      eq(release_components.componentVersionId, componentVersionId),
      limits,
    );
  }
}
