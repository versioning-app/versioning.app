import { Environment, environments } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { type AppHeaders } from '@/types/headers';
import { eq } from 'drizzle-orm';
import 'server-only';
import { NewEnvironment } from '../database/schema';
import { getSync } from '@/services/service-factory';

export class EnvironmentsService extends WorkspaceScopedRepository<
  typeof environments
> {
  private _environmentTypesService: EnvironmentTypesService | undefined;

  public constructor(headers: AppHeaders) {
    super(headers, environments);
  }

  private get environmentTypesService(): EnvironmentTypesService {
    if (!this._environmentTypesService) {
      this._environmentTypesService = getSync(
        EnvironmentTypesService,
        this.headers,
      );
    }
    return this._environmentTypesService;
  }

  public async create(
    newEnvironment: Pick<NewEnvironment, 'name' | 'typeId' | 'description'>,
  ): Promise<Environment> {
    if (!this.environmentTypesService.findOne(newEnvironment.typeId)) {
      throw new AppError(
        'Environment type not found',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    return super.create(
      newEnvironment,
      eq(environments.name, newEnvironment.name),
    );
  }
}
