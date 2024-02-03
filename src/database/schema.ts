import { integer, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const entityType = pgEnum('entity_type', ['user', 'organization']);

export const entities = pgTable('entities', {
  id: serial('id').unique(),
  type: entityType('type'),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
});

export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert;

export const components = pgTable('components', {
  id: serial('id').unique(),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  entityId: integer('entity_id').references(() => entities.id),
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
