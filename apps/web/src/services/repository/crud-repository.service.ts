import { db as AppDb } from '@/database/db';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { BaseService } from '@/services/base.service';
import { AppHeaders } from '@/types/headers';
import {
  InferInsertModel,
  InferSelectModel,
  Many,
  SQLWrapper,
  and,
  desc,
  eq,
  getTableName,
  sql,
} from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';
import { BaseRepository, QueryLimits } from './base-repository.service';

export abstract class CrudRepository<
    M extends PgTable,
    ID extends keyof M['$inferSelect'] = 'id',
  >
  extends BaseService
  implements BaseRepository<M, ID>
{
  protected constructor(
    headers: AppHeaders,
    protected db: typeof AppDb,
    public readonly schema: M,
    protected readonly primaryKey: ID,
  ) {
    super(headers);
  }

  public async hasDependents(
    id: string,
    clause?: SQLWrapper,
  ): Promise<boolean> {
    this.logger.debug({ id }, 'Checking for dependents');

    const manyRelations = // @ts-expect-error
      Object.entries(this.db._.schema?.[this.drizzleTableKey]?.relations)?.map(
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

    // @ts-expect-error
    const rows = await this.db.query[this.drizzleTableKey].findFirst({
      where: (fields: any, { eq }: any) => and(eq(fields.id, id), clause),
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

    this.logger.info(
      { id },
      'Resource cannot be deleted as it has dependent resources',
    );
    return true;
  }

  public get tableName(): string {
    return getTableName(this.schema);
  }

  public get drizzleTableKey(): string {
    return this.tableName;
  }

  public async findAll(clause?: SQLWrapper): Promise<InferSelectModel<M>[]> {
    this.logger.debug({ clause }, 'Finding all records');

    const records = await this.db
      .select()
      .from(this.schema)
      .where(and(clause))
      .orderBy(desc(sql`created_at`));

    this.logger.debug({ records }, 'Records found');

    return records as InferSelectModel<M>[];
  }

  public async findOne(
    id: M['$inferSelect'][ID],
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    this.logger.debug({ id, clause }, 'Finding one by ID');

    const results = await this.db
      .select()
      .from(this.schema)
      // @ts-expect-error - Primary key is derived from schema
      .where(and(eq(this.schema[this.primaryKey], id), clause))
      .orderBy(desc(sql`created_at`));

    if (results.length === 0) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    const [result] = results;

    this.logger.debug({ result }, 'Record found');

    return result as InferSelectModel<M>;
  }

  public async findOneBy(
    criteria: SQLWrapper,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    this.logger.debug({ criteria, clause }, 'Finding one by criteria');

    const result = await this.db
      .select()
      .from(this.schema)
      .where(and(criteria, clause))
      .orderBy(desc(sql`created_at`))
      .limit(1);

    const [resource] = result;

    if (!resource) {
      throw new AppError('Resource not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    this.logger.debug({ resource }, 'Record found');

    return resource;
  }

  public async findAllBy(
    criteria: SQLWrapper,
    limits?: QueryLimits,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>[]> {
    this.logger.debug({ criteria, limits, clause }, 'Finding all by criteria');

    const query = this.db
      .select()
      .from(this.schema)
      .where(and(criteria, clause))
      .orderBy(desc(sql`created_at`));

    if (limits?.limit) {
      query.limit(limits.limit);
      this.logger.debug({ limit: limits.limit }, 'Limiting query');
    }

    if (limits?.offset) {
      query.offset(limits.offset);
      this.logger.debug({ offset: limits.offset }, 'Offsetting query');
    }

    this.logger.debug({ query }, 'Querying for records');
    const results = await query;

    this.logger.debug({ results }, 'Records found');

    return results as InferSelectModel<M>[];
  }

  public async create(
    entity: InferInsertModel<M>,
    existingCheck?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    this.logger.debug({ entity }, 'Creating record');

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

    this.logger.debug({ inserted }, 'Record created successfully');

    return inserted as InferSelectModel<M>;
  }

  public async update(
    id: M['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<M>,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>> {
    this.logger.debug({ id, updateSet, clause }, 'Updating entity');

    const [updated] = await this.db
      .update(this.schema)
      .set(updateSet)
      // @ts-expect-error - Primary key is derived from schema
      .where(and(eq(this.schema[this.primaryKey], id), clause))
      .returning();

    this.logger.debug({ updated }, 'Entity updated successfully');

    return updated as InferSelectModel<M>;
  }

  public async delete(
    id: string,
    clause?: SQLWrapper,
    dependentCheckClause?: SQLWrapper,
    preventDependentCheck?: boolean,
  ): Promise<boolean> {
    // First check to see if anything depends
    if (
      !preventDependentCheck &&
      (await this.hasDependents(id, dependentCheckClause))
    ) {
      throw new AppError(
        'Resource cannot be deleted as it has dependent resources',
        ErrorCodes.RESOURCE_HAS_DEPENDENTS,
      );
    }

    const result = await this.db
      .delete(this.schema)
      // @ts-expect-error - Primary key is derived from schema
      .where(and(eq(this.schema[this.primaryKey], id), clause));

    this.logger.debug({ result }, 'Delete entity result');

    const deleted = result.rowCount >= 1;

    if (!deleted) {
      this.logger.warn({ id }, 'Failed to delete record');
      throw new AppError(
        'Failed to delete record',
        ErrorCodes.RECORD_DELETE_FAILURE,
      );
    }

    this.logger.debug({ id }, 'Record deleted successfully');
    return true;
  }
}
