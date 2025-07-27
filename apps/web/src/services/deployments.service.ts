import { db } from '@/database/db';
import { Deployment, NewDeployment, deployments } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { EnvironmentsService } from '@/services/environments.service';
import { ReleaseStepService } from '@/services/release-steps.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { CrudRepository } from '@/services/repository/crud-repository.service';
import { getSync } from '@/services/service-factory';
import { type AppHeaders } from '@/types/headers';
import { InferSelectModel, and, eq, inArray } from 'drizzle-orm';
import 'server-only';

export class DeploymentsService extends CrudRepository<typeof deployments> {
  private _releaseStepService: ReleaseStepService | undefined;
  private _environmentsService: EnvironmentsService | undefined;

  public constructor(headers: AppHeaders) {
    super(headers, db, deployments, 'id');
  }

  private get releaseStepService(): ReleaseStepService {
    if (!this._releaseStepService) {
      this._releaseStepService = getSync(ReleaseStepService, this.headers);
    }
    return this._releaseStepService;
  }

  private get environmentsService(): EnvironmentsService {
    if (!this._environmentsService) {
      this._environmentsService = getSync(EnvironmentsService, this.headers);
    }
    return this._environmentsService;
  }

  public async findAll() {
    this.logger.debug('Finding all deployments');

    const environments = await this.environmentsService.findAll();

    return this.findAllBy(
      inArray(
        deployments.environmentId,
        environments.map((c) => c.id),
      ),
    );
  }

  public async findAllByEnvironmentId(
    environmentId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof deployments>[]> {
    const environment = await this.environmentsService.findOne(environmentId);

    if (!environment) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(eq(deployments.environmentId, environmentId), limits);
  }

  public async findAllByReleaseStepId(
    releaseStepId: string,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<typeof deployments>[]> {
    const environment = await this.releaseStepService.findOne(releaseStepId);

    if (!environment) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return this.findAllBy(eq(deployments.releaseStepId, releaseStepId), limits);
  }

  public async create(
    newDeployment: Pick<
      NewDeployment,
      'environmentId' | 'releaseStepId' | 'status'
    >,
  ): Promise<Deployment> {
    return super.create(
      newDeployment,
      and(
        eq(deployments.releaseStepId, newDeployment.releaseStepId),
        eq(deployments.environmentId, newDeployment.environmentId),
      ),
    );
  }
}
