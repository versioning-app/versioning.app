import { db as AppDb } from '@/database/db';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceService } from '@/services/workspace.service';
import {
  InferInsertModel,
  InferSelectModel,
  SQLWrapper,
  and,
  eq,
  getTableName,
} from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';
import { CrudRepository } from './crud-repository.service';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { get } from '@/services/service-factory';
import { Many } from 'drizzle-orm';

export abstract class WorkspaceScopedRepository<
  M extends PgTable,
  ID extends keyof M['$inferSelect'] = 'id',
> extends CrudRepository<M, ID> {
  private readonly workspaceService: WorkspaceService;

  public constructor(
    protected readonly schema: M,
    db?: typeof AppDb,
    primaryKey?: ID,
  ) {
    super(db ?? AppDb, schema, primaryKey ?? ('id' as ID));
    this.workspaceService = get(WorkspaceService);
  }

  public get currentWorkspaceId(): Promise<string> {
    return this.workspaceService.currentWorkspaceId();
  }

  public async currentWorkspace() {
    return this.workspaceService.currentWorkspace();
  }

  public async hasDependents(id: string): Promise<boolean> {
    this.logger.debug({ id }, 'Checking for dependents');

    const manyRelations =
      // @ts-expect-error
      Object.entries(this.db._.schema[this.drizzleTableKey].relations).map(
        ([key, relation]) => {
          if (relation instanceof Many) {
            return { key, relation };
          }
        },
      );

    // if we do not have any relations, we can safely return false
    if (!manyRelations?.length) {
      this.logger.info({ id }, 'No dependents found');
      return false;
    }

    const workspaceId = await this.currentWorkspaceId;

    // @ts-expect-error
    const rows = await this.db.query[this.drizzleTableKey].findFirst({
      where: (fields: any, { eq }: any) =>
        and(eq(fields.id, id), eq(fields.workspaceId, workspaceId)),
      columns: {
        id: true,
      },
      with: {
        ...manyRelations.reduce((acc, relation) => {
          if (!relation) {
            return acc;
          }

          acc[relation.key] = true;
          return acc;
        }, {} as any),
      },
    });

    const hasDependents = manyRelations.some((relation) => {
      if (!relation) {
        return false;
      }

      const { key } = relation;

      this.logger.debug({ key }, 'Checking dependent relation');

      const relationHasDependents = rows?.[key]?.length > 0;

      this.logger.debug({ key, relationHasDependents }, 'Relation check done');

      return relationHasDependents;
    });

    if (!hasDependents) {
      this.logger.info({ id }, 'Resource does not have dependents');
      return false;
    }

    this.logger.info({ id }, 'Resource has dependents');
    return true;
  }

  public async findAll(): Promise<InferSelectModel<M>[]> {
    const workspaceId = await this.currentWorkspaceId;

    this.logger.debug({ workspaceId }, 'Finding all records');

    const results = await super.findAll(
      // @ts-expect-error - Workspace ID is defined
      eq(this.schema.workspaceId, workspaceId),
    );

    this.logger.debug({ results, workspaceId }, 'Records found');

    return results;
  }

  public async findOne(
    id: M['$inferSelect'][ID],
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    this.logger.debug({ id, workspaceId }, 'Finding one record');

    const result = await super.findOne(
      id,
      // @ts-expect-error - Workspace ID is defined
      eq(this.schema.workspaceId, workspaceId),
    );

    this.logger.debug({ result, id, workspaceId }, 'Record found');

    return result;
  }

  public async findAllBy(
    criteria: SQLWrapper,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<M>[]> {
    const workspaceId = await this.currentWorkspaceId;

    this.logger.debug(
      { criteria, workspaceId },
      'Finding all records by criteria',
    );

    const results = await super.findAllBy(
      criteria,
      limits,
      // @ts-expect-error - Workspace ID is defined
      eq(this.schema.workspaceId, workspaceId),
    );

    this.logger.debug(
      { results, criteria, workspaceId },
      'Records all records by criteria',
    );

    return results;
  }

  public async create(
    entity: Omit<InferInsertModel<M>, 'workspaceId'>,
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    this.logger.debug({ entity, workspaceId }, 'Creating record');

    const created = await super.create({
      ...entity,
      workspaceId,
    } as InferInsertModel<M>);

    this.logger.debug({ created, entity, workspaceId }, 'Record created');

    return created;
  }

  public async update(
    id: M['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<M>,
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    this.logger.debug({ id, updateSet, workspaceId }, 'Updating record');

    const updated = await super.update(id, updateSet);

    this.logger.debug(
      { updated, id, updateSet, workspaceId },
      'Record updated',
    );

    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const workspaceId = await this.currentWorkspaceId;

    // First check to see if anything depends
    if (await this.hasDependents(id)) {
      throw new AppError(
        'Resource has dependents',
        ErrorCodes.RESOURCE_HAS_DEPENDENTS,
      );
    }

    this.logger.debug({ id, workspaceId }, 'Deleting record');

    const result = await super.delete(
      id,
      // @ts-expect-error - Workspace ID is defined
      eq(this.schema.workspaceId, workspaceId),
    );

    if (!result) {
      this.logger.warn({ id, workspaceId }, 'Failed to delete record');
      throw new AppError(
        'Failed to delete record',
        ErrorCodes.RECORD_DELETE_FAILURE,
      );
    }

    this.logger.info(
      { result, id, workspaceId },
      'Record deleted successfully',
    );

    return result;
  }
}
