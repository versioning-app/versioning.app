import { db } from '@/database/db';
import { BaseService } from '@/services/base.service';
import { PgTable, TableConfig } from 'drizzle-orm/pg-core';

export abstract class DatabaseService<
  TFrom extends PgTable<TableConfig>,
> extends BaseService {
  protected readonly source: PgTable<TableConfig>;

  public constructor(source: TFrom) {
    super();
    this.source = source;
  }

  public get sourceName(): string {
    return this.source._.name;
  }

  public async create(
    resource: Omit<typeof this.source.$inferSelect, 'id' | 'workspaceId'>,
  ): Promise<typeof this.source.$inferSelect> {
    this.logger.debug(
      { resource },
      `Creating new resource for ${this.sourceName}`,
    );

    const newResource = await db
      .insert(this.source)
      .values(resource)
      .returning();

    this.logger.debug(
      { resource },
      `Created new resource for ${this.sourceName}`,
    );

    return newResource as unknown as typeof this.source.$inferSelect;
  }
}
