import { bigserial, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';

export const entityType = pgEnum('entity_type', ['user', 'organization']);

export const entities = pgTable('entities', {
  id: bigserial('id', { mode: 'number' }),
  type: entityType('type'),
  clerkId: varchar('clerk_id', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
});
