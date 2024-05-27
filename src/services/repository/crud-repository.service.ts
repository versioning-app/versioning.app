import { db as AppDb } from '@/database/db';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { BaseService } from '@/services/base.service';
import {
  ExtractTableRelationsFromSchema,
  InferInsertModel,
  InferSelectModel,
  SQLWrapper,
  and,
  eq,
  getTableName,
} from 'drizzle-orm';
import {
  PgUpdateSetSource,
  getTableConfig,
  type PgTable,
} from 'drizzle-orm/pg-core';
import { BaseRepository, QueryLimits } from './base-repository.service';
import { snakeToCamel } from '@/lib/utils';
import * as schema from '@/database/schema';

export abstract class CrudRepository<
    M extends PgTable,
    ID extends keyof M['$inferSelect'],
  >
  extends BaseService
  implements BaseRepository<M, ID>
{
  protected constructor(
    protected db: typeof AppDb,
    protected readonly schema: M,
    protected readonly primaryKey: ID,
  ) {
    super();
  }

  public get tableName(): string {
    return getTableName(this.schema);
  }

  public get drizzleTableKey(): string {
    return snakeToCamel(this.tableName);
  }

  public async findAll(clause?: SQLWrapper): Promise<InferSelectModel<M>[]> {
    return this.db.select().from(this.schema).where(and(clause)) as Promise<
      InferSelectModel<M>[]
    >;
  }

  public async findOne(
    id: M['$inferSelect'][ID],
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    if (!id) {
      throw new Error('Id is required');
    }

    const result = await this.db
      .select()
      .from(this.schema)
      // @ts-expect-error - Primary key is derived from schema
      .where(and(eq(this.schema[this.primaryKey], id), clause));

    if (result.length == 0) {
      throw new Error('Entity not found');
    }

    return result[0] as InferSelectModel<M>;
  }

  public async findOneBy(
    criteria: SQLWrapper,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(and(criteria, clause))
      .limit(1);

    const [resource] = result;

    if (!resource) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    return resource;
  }

  public async findAllBy(
    criteria: SQLWrapper,
    limits?: QueryLimits,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>[]> {
    const query = this.db
      .select()
      .from(this.schema)
      .where(and(criteria, clause));

    if (limits?.limit) {
      query.limit(limits.limit);
    }

    if (limits?.offset) {
      query.offset(limits.offset);
    }

    return query as Promise<InferSelectModel<M>[]>;
  }

  public async create(
    entity: InferInsertModel<M>,
    existingCheck?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    if (existingCheck) {
      const existing = await this.findAllBy(existingCheck);

      if (existing?.length > 0) {
        throw new AppError(
          'Resource already exists',
          ErrorCodes.RESOURCE_ALREADY_EXISTS,
        );
      }
    }

    const [inserted] = await this.db
      .insert(this.schema)
      .values({ ...entity })
      .returning();

    return inserted as InferSelectModel<M>;
  }

  public async update(
    id: M['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<M>,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    const [updated] = await this.db
      .update(this.schema)
      .set(updateSet)
      // @ts-expect-error - Primary key is derived from schema
      .where(and(eq(this.schema[this.primaryKey], id), clause))
      .returning();

    return updated as InferSelectModel<M>;
  }

  public async delete(id: string, clause?: SQLWrapper): Promise<boolean> {
    const result = await this.db
      .delete(this.schema)
      // @ts-expect-error - Primary key is derived from schema
      .where(and(eq(this.schema[this.primaryKey], id), clause));

    this.logger.debug({ result }, 'Delete entity result');

    return result.rowCount >= 1;
  }
}
