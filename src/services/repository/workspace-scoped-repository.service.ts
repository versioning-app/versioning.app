import { db as AppDb } from '@/database/db';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceService } from '@/services/workspace.service';
import {
  InferInsertModel,
  InferSelectModel,
  SQLWrapper,
  eq,
} from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';
import { CrudRepository } from './crud-repository.service';
import { QueryLimits } from '@/services/repository/base-repository.service';

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
    this.workspaceService = new WorkspaceService();
  }

  public get currentWorkspaceId(): Promise<string> {
    return this.workspaceService.currentWorkspaceId();
  }

  public async currentWorkspace() {
    return this.workspaceService.currentWorkspace();
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
