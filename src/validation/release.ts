import { release_strategy_steps, releases } from '@/database/schema';
import { DEFAULT_OMITTED_FIELDS } from '@/validation/defaults';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertReleaseSchema = createInsertSchema(releases);
const selectReleaseSchema = createSelectSchema(releases);

export const createReleaseSchema = insertReleaseSchema.omit(
  DEFAULT_OMITTED_FIELDS,
);

export const deleteReleaseSchema = selectReleaseSchema.pick({ id: true });

const insertReleaseStrategyStepSchema = createInsertSchema(
  release_strategy_steps,
);
const selectReleaseStrategyStepSchema = createSelectSchema(
  release_strategy_steps,
);

export const createReleaseStrategyStepSchema =
  insertReleaseStrategyStepSchema.omit(DEFAULT_OMITTED_FIELDS);

export const deleteReleaseStrategyStepSchema =
  selectReleaseStrategyStepSchema.pick({ id: true });

export const createReleaseStrategySchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).optional(),
});

export const deleteReleaseStrategySchema = z.object({
  id: z.string(),
});
