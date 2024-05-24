import { db as AppDb } from '@/database/db';
import { BaseService } from '@/services/base.service';
import {
  InferInsertModel,
  InferSelectModel,
  SQLWrapper,
  and,
  eq,
} from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';
import { BaseRepository, QueryCriteria } from './base-repository.service';

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

  public async findAll(clause?: SQLWrapper): Promise<InferSelectModel<M>[]> {
    return this.db.select().from(this.schema).where(and(clause)) as Promise<
      InferSelectModel<M>[]
    >;
  }

  async findOne(
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

  public async findAllBy(
    criteria: QueryCriteria,
    clause?: SQLWrapper,
  ): Promise<InferSelectModel<M>[]> {
    const query = this.db.select().from(this.schema).where(and(clause));

    if (criteria.limit) {
      query.limit(criteria.limit);
    }

    if (criteria.offset) {
      query.offset(criteria.offset);
    }

    return query as Promise<InferSelectModel<M>[]>;
  }

  public async create(
    entity: InferInsertModel<M>,
  ): Promise<InferSelectModel<M>> {
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
