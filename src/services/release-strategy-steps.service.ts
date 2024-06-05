import { db } from '@/database/db';
import {
  NewReleaseStrategyStep,
  ReleaseStrategyStep,
  release_strategy_steps,
} from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { get } from '@/services/service-factory';
import { InferSelectModel, eq, inArray } from 'drizzle-orm';
import 'server-only';

export class ReleaseStrategyStepService extends CrudRepository<
  typeof release_strategy_steps
> {
  private releaseStrategiesService: ReleaseStrategiesService;

  public constructor() {
    super(db, release_strategy_steps, 'id');

    this.releaseStrategiesService = get(ReleaseStrategiesService);
  }

  public async findAll() {
    this.logger.debug('Finding all release strategy steps');

    const releaseStrategies = await this.releaseStrategiesService.findAll();

    return this.findAllBy(
      inArray(
        release_strategy_steps.strategyId,
        releaseStrategies.map((c) => c.id),
      ),
    );
  }

  public async findAllByStrategyId(
    strategyId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof release_strategy_steps>[]> {
    const component = await this.releaseStrategiesService.findOne(strategyId);

    if (!component) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(
      eq(release_strategy_steps.strategyId, strategyId),
      limits,
    );
  }

  public async create(
    newReleaseStrategyStep: Pick<
      NewReleaseStrategyStep,
      | 'action'
      | 'approvalGroupId'
      | 'description'
      | 'name'
      | 'parentId'
      | 'strategyId'
    >,
  ): Promise<ReleaseStrategyStep> {
    // Check that parent id exists, if not throw an error
    if (newReleaseStrategyStep.parentId) {
      const parent = await this.findOne(newReleaseStrategyStep.parentId);

      if (!parent) {
        throw new AppError(
          'Parent release strategy step not found',
          ErrorCodes.RESOURCE_NOT_FOUND,
        );
      }
    }

    return super.create(
      newReleaseStrategyStep,
      eq(release_strategy_steps.name, newReleaseStrategyStep.name),
    );
  }
}
