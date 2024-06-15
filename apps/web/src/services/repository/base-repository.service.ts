import { InferInsertModel, InferSelectModel, SQLWrapper } from 'drizzle-orm';
import { PgUpdateSetSource, type PgTable } from 'drizzle-orm/pg-core';

export interface QueryLimits {
  limit?: number;
  offset?: number;
}

export interface BaseRepository<
  T extends PgTable,
  ID extends keyof T['$inferSelect'],
> {
  findAll(): Promise<InferSelectModel<T>[]>;
  findOne(id: T['$inferSelect'][ID]): Promise<InferSelectModel<T> | undefined>;
  findOneBy(criteria: SQLWrapper): Promise<InferSelectModel<T> | undefined>;
  findAllBy(
    criteria: SQLWrapper,
    limits?: QueryLimits,
  ): Promise<InferSelectModel<T>[]>;

  create(
    entity: InferInsertModel<T>,
    existingCheck?: SQLWrapper,
  ): Promise<InferSelectModel<T>>;
  update(
    id: T['$inferSelect'][ID],
    updateSet: PgUpdateSetSource<T>,
  ): Promise<InferSelectModel<T>>;
  delete(id: string): Promise<boolean>;
}
