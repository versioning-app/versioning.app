import { DEFAULT_OMITTED_FIELDS } from '@/validation/defaults';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { deployments } from '../database/schema';

const insertDeploymentsSchema = createInsertSchema(deployments);
const selectDeploymentsSchema = createSelectSchema(deployments);

export const createDeploymentsSchema = insertDeploymentsSchema.omit(
  DEFAULT_OMITTED_FIELDS,
);

export const deleteDeploymentsSchema = selectDeploymentsSchema.pick({
  id: true,
});
