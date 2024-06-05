import { db } from '@/database/db';
import { NewReleaseStep, ReleaseStep, release_steps } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { ReleaseService } from '@/services/release.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { get } from '@/services/service-factory';
import { InferSelectModel, and, eq, inArray } from 'drizzle-orm';
import 'server-only';

export class ReleaseStepService extends CrudRepository<typeof release_steps> {
  private releaseService: ReleaseService;
  private releaseStrategyStepService: ReleaseStrategyStepService;

  public constructor() {
    super(db, release_steps, 'id');

    this.releaseService = get(ReleaseService);
    this.releaseStrategyStepService = get(ReleaseStrategyStepService);
  }

  public async findAll() {
    this.logger.debug('Finding all release steps');

    const releases = await this.releaseService.findAll();

    return this.findAllBy(
      inArray(
        release_steps.releaseId,
        releases.map((c) => c.id),
      ),
    );
  }

  public async findAllByReleaseId(
    releaseId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof release_steps>[]> {
    const component = await this.releaseService.findOne(releaseId);

    if (!component) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(eq(release_steps.releaseId, releaseId), limits);
  }

  public async findAllByReleaseStrategyStepId(
    releaseStrategyStepId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof release_steps>[]> {
    const component = await this.releaseStrategyStepService.findOne(
      releaseStrategyStepId,
    );

    if (!component) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(
      eq(release_steps.releaseStrategyStepId, releaseStrategyStepId),
      limits,
    );
  }

  public async create(
    newReleaseStep: Pick<
      NewReleaseStep,
      'finalizedAt' | 'releaseId' | 'releaseStrategyStepId' | 'status'
    >,
  ): Promise<ReleaseStep> {
    return super.create(
      newReleaseStep,
      and(
        eq(release_steps.releaseId, newReleaseStep.releaseId),
        eq(
          release_steps.releaseStrategyStepId,
          newReleaseStep.releaseStrategyStepId,
        ),
      ),
    );
  }
}
