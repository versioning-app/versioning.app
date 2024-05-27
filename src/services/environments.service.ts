import { Environment, environments } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { eq } from 'drizzle-orm';
import 'server-only';
import { NewEnvironment } from './../database/schema';

export class EnvironmentsService extends WorkspaceScopedRepository<
  typeof environments
> {
  private readonly environmentTypesService;
  public constructor() {
    super(environments);

    this.environmentTypesService = new EnvironmentTypesService();
  }

  public async create(
    newEnvironment: Pick<NewEnvironment, 'name' | 'typeId' | 'description'>,
  ): Promise<Environment> {
    if (!(await this.environmentTypesService.findOne(newEnvironment.typeId))) {
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
