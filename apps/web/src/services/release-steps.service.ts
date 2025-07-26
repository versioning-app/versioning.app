import { db } from '@/database/db';
import { NewReleaseStep, ReleaseStep, release_steps } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { ReleaseService } from '@/services/release.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { getSync } from '@/services/service-factory';
import { type AppHeaders } from '@/types/headers';
import { InferSelectModel, and, eq, inArray } from 'drizzle-orm';
import 'server-only';

export class ReleaseStepService extends CrudRepository<typeof release_steps> {
  public constructor(headers: AppHeaders) {
    super(headers, db, release_steps, 'id');
  }

  private get releaseService(): ReleaseService {
    if (!this._releaseService) {
      this._releaseService = getSync(ReleaseService, this.headers);
    }
    return this._releaseService;
  }

  private _releaseService: ReleaseService | undefined;

  private get releaseStrategyStepService(): ReleaseStrategyStepService {
    if (!this._releaseStrategyStepService) {
      this._releaseStrategyStepService = getSync(
        ReleaseStrategyStepService,
        this.headers,
      );
    }
    return this._releaseStrategyStepService;
  }

  private _releaseStrategyStepService: ReleaseStrategyStepService | undefined;

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
    const release = await this.releaseService.findOne(releaseId);

    if (!release) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(eq(release_steps.releaseId, releaseId), limits);
  }

  public async findAllByReleaseStrategyStepId(
    releaseStrategyStepId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof release_steps>[]> {
    const releaseStrategyStep = await this.releaseStrategyStepService.findOne(
      releaseStrategyStepId,
    );

    if (!releaseStrategyStep) {
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
      // and(
      //   eq(release_steps.releaseId, newReleaseStep.releaseId),
      //   eq(
      //     release_steps.releaseStrategyStepId,
      //     newReleaseStep.releaseStrategyStepId,
      //   ),
      // ),
    );
  }
}
