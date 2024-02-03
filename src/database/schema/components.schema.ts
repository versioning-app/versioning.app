import { entities } from '@/database/schema';
import { bigserial, pgTable, varchar } from 'drizzle-orm/pg-core';

export const components = pgTable('components', {
  id: bigserial('id', { mode: 'number' }),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  entityId: bigserial('entity_id', { mode: 'number' }).references(
    () => entities.id
  ),
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
