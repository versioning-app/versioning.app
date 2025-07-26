import { Environment, environments } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { type AppHeaders } from '@/types/headers';
import { eq } from 'drizzle-orm';
import 'server-only';
import { NewEnvironment } from '../database/schema';

export class EnvironmentsService extends WorkspaceScopedRepository<
  typeof environments
> {
  private environmentTypesService: EnvironmentTypesService | undefined;
  
  public constructor(headers: AppHeaders) {
    super(headers, environments);
  }

  private async getEnvironmentTypesService(): Promise<EnvironmentTypesService> {
    if (!this.environmentTypesService) {
      this.environmentTypesService = new EnvironmentTypesService(this.headers);
    }
    return this.environmentTypesService;
  }

  public async create(
    newEnvironment: Pick<NewEnvironment, 'name' | 'typeId' | 'description'>,
  ): Promise<Environment> {
    const environmentTypesService = await this.getEnvironmentTypesService();
    if (!(await environmentTypesService.findOne(newEnvironment.typeId))) {
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
