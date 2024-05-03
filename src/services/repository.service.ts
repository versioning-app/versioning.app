import { InferInsertModel, InferSelectModel, eq, sql } from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';
import { db as AppDb } from '@/database/db';

export interface QueryCriteria {
  limit?: number;
  offset?: number;
}

export interface BaseRepository<
  T extends PgTable,
  ID extends keyof T['$inferSelect'],
> {
  findAll(): Promise<InferSelectModel<T>[]>;
  findById(id: T['$inferSelect'][ID]): Promise<InferSelectModel<T> | undefined>;
  findAllBy(criteria: QueryCriteria): Promise<InferSelectModel<T>[]>;

  create(entity: InferInsertModel<T>): Promise<InferSelectModel<T>>;
  update(
    id: T['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<T>,
  ): Promise<InferSelectModel<T>>;
  delete(id: string): Promise<void>;
}

export abstract class CrudRepository<
  M extends PgTable,
  ID extends keyof M['$inferSelect'],
> implements BaseRepository<M, ID>
{
  protected constructor(
    protected db: typeof AppDb,
    protected readonly schema: M,
    protected readonly primaryKey: ID,
  ) {}

  public async findAll(): Promise<InferSelectModel<M>[]> {
    return this.db.select().from(this.schema) as Promise<InferSelectModel<M>[]>;
  }
  async findOne(id: M['$inferSelect'][ID]): Promise<InferSelectModel<M>> {
    if (!id) {
      throw new Error('Id is required');
    }

    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(sql`${this.primaryKey}`, id));

    if (result.length == 0) {
      throw new Error('Entity not found');
    }

    return result[0] as InferSelectModel<M>;
  }

  public async findById(
    id: M['$inferSelect'][ID],
  ): Promise<InferSelectModel<M> | undefined> {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(sql`${this.primaryKey}`, id))
      .then((result) => result[0]);
  }

  public async findAllBy(
    criteria: QueryCriteria,
  ): Promise<InferSelectModel<M>[]> {
    const query = this.db.select().from(this.schema);

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
  ): Promise<InferSelectModel<M>> {
    const [updated] = await this.db
      .update(this.schema)
      .set(updateSet)
      .where(eq(sql`${this.primaryKey}`, id))
      .returning();

    return updated as InferSelectModel<M>;
  }

  public async delete(id: string): Promise<void> {
    await this.db.delete(this.schema).where(eq(sql`${this.primaryKey}`, id));
  }
}
