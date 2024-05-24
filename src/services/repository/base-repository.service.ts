import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';

export interface QueryCriteria {
  limit?: number;
  offset?: number;
}

export interface BaseRepository<
  T extends PgTable,
  ID extends keyof T['$inferSelect'],
> {
  findAll(): Promise<InferSelectModel<T>[]>;
  findOne(id: T['$inferSelect'][ID]): Promise<InferSelectModel<T> | undefined>;
  findAllBy(criteria: QueryCriteria): Promise<InferSelectModel<T>[]>;

  create(entity: InferInsertModel<T>): Promise<InferSelectModel<T>>;
  update(
    id: T['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<T>,
  ): Promise<InferSelectModel<T>>;
  delete(id: string): Promise<boolean>;
}
