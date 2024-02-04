import { createId } from '@paralleldrive/cuid2';
import { pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';

const identifierColumn = () =>
  varchar('id', { length: 128 })
    .notNull()
    .unique()
    .$defaultFn(() => createId());

export const workspaceType = pgEnum('workspace_type', ['user', 'organization']);

export const workspaces = pgTable('workspaces', {
  id: identifierColumn(),
  type: workspaceType('type'),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export const components = pgTable('components', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  workspaceId: varchar('workspace_id').references(() => workspaces.id),
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
