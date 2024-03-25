import { db } from '@/database/db';
import {
  NewReleaseStrategy,
  ReleaseStrategy,
  releaseStrategies,
} from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceScopedService } from '@/services/workspace-scoped-service';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export class ReleaseService extends WorkspaceScopedService {
  public constructor() {
    super();
  }

  public async createReleaseStrategy(
    newReleaseStrategy: Pick<NewReleaseStrategy, 'name' | 'description'>,
  ) {
    const workspaceId = await this.currentWorkspaceId;

    const [environmentType] = await db
      .insert(releaseStrategies)
      .values({
        ...newReleaseStrategy,
        workspaceId,
      })
      .returning();

    this.logger.debug({ environmentType }, 'Release Strategy created');

    return environmentType;
  }

  public async getReleaseStrategies(): Promise<ReleaseStrategy[] | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    const allEnvironmentTypes = await db
      .select()
      .from(releaseStrategies)
      .where(eq(releaseStrategies.workspaceId, workspaceId));

    this.logger.debug({ allEnvironmentTypes }, 'Release Strategies found');

    return allEnvironmentTypes;
  }

  public async getReleaseStrategy(
    releaseStrategyId: string,
  ): Promise<ReleaseStrategy | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    try {
      const [releaseStrategy] = await db
        .select()
        .from(releaseStrategies)
        .where(
          and(
            eq(releaseStrategies.workspaceId, workspaceId),
            eq(releaseStrategies.id, releaseStrategyId),
          ),
        );

      this.logger.debug({ releaseStrategy }, 'Release Strategy found');

      return releaseStrategy;
    } catch (error) {
      this.logger.warn({ error }, 'Error finding release strategy');
      return undefined;
    }
  }

  public async checkReleaseStrategyDependents(
    releaseStrategyId: string,
  ): Promise<boolean> {
    const workspaceId = await this.currentWorkspaceId;

    const results = await db.query.releaseStrategies.findFirst({
      where: (types, { eq }) =>
        and(
          eq(types.id, releaseStrategyId),
          eq(types.workspaceId, workspaceId),
        ),
      columns: {
        id: true,
      },
      with: { steps: true },
    });

    return !!results?.steps?.length;
  }

  public async deleteReleaseStrategy(releaseStrategyId: string) {
    const workspaceId = await this.currentWorkspaceId;

    // First check to see if anything depends
    if (await this.checkReleaseStrategyDependents(releaseStrategyId)) {
      throw new AppError(
        'Release Strategy has dependents',
        ErrorCodes.RESOURCE_HAS_DEPENDENTS,
      );
    }

    const result = await db
      .delete(releaseStrategies)
      .where(
        and(
          eq(releaseStrategies.workspaceId, workspaceId),
          eq(releaseStrategies.id, releaseStrategyId),
        ),
      );

    return result.rowCount === 1;
  }
}
