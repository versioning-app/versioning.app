import { db } from '@/database/db';
import {
  Environment,
  EnvironmentType,
  NewEnvironmentType,
  environmentTypes,
  environments,
} from '@/database/schema';
import { WorkspaceScopedService } from '@/services/workspace-scoped-service';
import { and, eq } from 'drizzle-orm';
import 'server-only';
import { NewEnvironment } from './../database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';

export class EnvironmentsService extends WorkspaceScopedService {
  public constructor() {
    super();
  }

  public async createEnvironmentType(
    newEnvironmentType: Pick<
      NewEnvironmentType,
      'description' | 'label' | 'style'
    >,
  ) {
    const workspaceId = await this.currentWorkspaceId;

    const [environmentType] = await db
      .insert(environmentTypes)
      .values({
        ...newEnvironmentType,
        workspaceId,
      })
      .returning();

    this.logger.debug({ environmentType }, 'Environment type created');

    return environmentType;
  }

  public async getEnvironmentTypes(): Promise<EnvironmentType[] | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    const allEnvironmentTypes = await db
      .select()
      .from(environmentTypes)
      .where(eq(environmentTypes.workspaceId, workspaceId));

    this.logger.debug({ allEnvironmentTypes }, 'Environment types found');

    return allEnvironmentTypes;
  }

  public async getEnvironmentTypeById(
    environmentTypeId: string,
  ): Promise<EnvironmentType | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    try {
      const [environmentType] = await db
        .select()
        .from(environmentTypes)
        .where(
          and(
            eq(environmentTypes.workspaceId, workspaceId),
            eq(environmentTypes.id, environmentTypeId),
          ),
        );

      this.logger.debug({ environmentType }, 'Environment type found');

      return environmentType;
    } catch (error) {
      this.logger.warn({ error }, 'Error finding environment type');
      return undefined;
    }
  }

  public async checkEnvironmentTypeDependents(
    environmentTypeId: string,
  ): Promise<boolean> {
    const workspaceId = await this.currentWorkspaceId;

    const results = await db.query.environmentTypes.findFirst({
      where: (types, { eq }) =>
        and(
          eq(types.id, environmentTypeId),
          eq(types.workspaceId, workspaceId),
        ),
      columns: {
        id: true,
      },
      with: {
        environments: {
          columns: {
            id: true,
          },
        },
      },
    });

    return !!results?.environments?.length;
  }

  public async deleteEnvironmentType(environmentTypeId: string) {
    const workspaceId = await this.currentWorkspaceId;

    // First check to see if anything depends
    if (await this.checkEnvironmentTypeDependents(environmentTypeId)) {
      throw new AppError(
        'Environment type has dependents',
        ErrorCodes.RESOURCE_HAS_DEPENDENTS,
      );
    }

    const result = await db
      .delete(environmentTypes)
      .where(
        and(
          eq(environmentTypes.workspaceId, workspaceId),
          eq(environmentTypes.id, environmentTypeId),
        ),
      );

    return result.rowCount === 1;
  }

  public async createEnvironment(
    newEnvironment: Pick<NewEnvironment, 'name' | 'typeId' | 'description'>,
  ): Promise<Environment> {
    const workspaceId = await this.currentWorkspaceId;

    if (!(await this.getEnvironmentTypeById(newEnvironment.typeId))) {
      throw new AppError(
        'Environment type not found',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    const [environment] = await db
      .insert(environments)
      .values({
        ...newEnvironment,
        workspaceId,
      })
      .returning();

    this.logger.debug({ environment }, 'Environment created');

    return environment;
  }

  public async getEnvironments(): Promise<Environment[] | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    const allEnvironments = await db
      .select()
      .from(environments)
      .where(eq(environments.workspaceId, workspaceId));

    this.logger.debug({ allEnvironments }, 'Environments found');

    return allEnvironments;
  }

  public async getEnvironmentById(
    environmentId: string,
  ): Promise<Environment | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    try {
      const [environment] = await db
        .select()
        .from(environments)
        .where(
          and(
            eq(environments.workspaceId, workspaceId),
            eq(environments.id, environmentId),
          ),
        );

      this.logger.debug({ environment }, 'Environment found');

      return environment;
    } catch (error) {
      this.logger.warn({ error }, 'Error finding environment');
      return undefined;
    }
  }

  public async deleteEnvironment(environmentId: string) {
    const workspaceId = await this.currentWorkspaceId;

    const result = await db
      .delete(environments)
      .where(
        and(
          eq(environments.workspaceId, workspaceId),
          eq(environments.id, environmentId),
        ),
      );

    return result.rowCount === 1;
  }
}
