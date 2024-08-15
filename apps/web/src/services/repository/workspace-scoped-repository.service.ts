import { db as AppDb } from '@/database/db';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { QueryLimits } from '@/services/repository/base-repository.service';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import {
  InferInsertModel,
  InferSelectModel,
  Many,
  SQLWrapper,
  and,
  eq,
} from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';
import { CrudRepository } from './crud-repository.service';

export abstract class WorkspaceScopedRepository<
  M extends PgTable,
  ID extends keyof M['$inferSelect'] = 'id',
> extends CrudRepository<M, ID> {
  private readonly workspaceService: WorkspaceService;

  public constructor(
    public readonly schema: M,
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

  public async hasDependents(
    id: string,
    clause?: SQLWrapper,
  ): Promise<boolean> {
    return super.hasDependents(
      id,
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, await this.currentWorkspaceId), clause),
    );
  }

  public async findAll(clause?: SQLWrapper): Promise<InferSelectModel<M>[]> {
    const workspaceId = await this.currentWorkspaceId;

    return super.findAll(
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, workspaceId), clause),
    );
  }

  public async findOneBy(
    criteria: SQLWrapper,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    return super.findOneBy(
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, workspaceId), criteria),
      clause,
    );
  }

  public async findOne(
    id: M['$inferSelect'][ID],
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    return super.findOne(
      id,
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, workspaceId), clause),
    );
  }

  public async findAllBy(
    criteria: SQLWrapper,
    limits?: QueryLimits,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>[]> {
    const workspaceId = await this.currentWorkspaceId;

    return super.findAllBy(
      criteria,
      limits,
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, workspaceId), clause),
    );
  }

  public async create(
    entity: Omit<InferInsertModel<M>, 'workspaceId'>,
    checkExisting?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    return super.create(
      {
        ...entity,
        workspaceId,
      } as InferInsertModel<M>,
      checkExisting
        ? // @ts-expect-error - Workspace ID is defined
          and(eq(this.schema.workspaceId, workspaceId), checkExisting)
        : undefined,
    );
  }

  public async update(
    id: M['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<M>,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    const workspaceId = await this.currentWorkspaceId;

    return super.update(
      id,
      updateSet,
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, workspaceId), clause),
    );
  }

  public async delete(
    id: string,
    clause?: SQLWrapper,
    dependentCheckClause?: SQLWrapper,
    preventDependentCheck?: boolean,
  ): Promise<boolean> {
    const workspaceId = await this.currentWorkspaceId;

    return super.delete(
      id,
      // @ts-expect-error - Workspace ID is defined
      and(eq(this.schema.workspaceId, workspaceId), clause),
      dependentCheckClause,
      preventDependentCheck,
    );
  }
}
