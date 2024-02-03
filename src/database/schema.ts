import { integer, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const workspaceType = pgEnum('workspace_type', ['user', 'organization']);

export const workspaces = pgTable('workspaces', {
  id: serial('id').unique(),
  type: workspaceType('type'),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export const components = pgTable('components', {
  id: serial('id').unique(),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  workspaceId: integer('workspace_id').references(() => workspaces.id),
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
