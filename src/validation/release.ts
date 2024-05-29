import { releases } from '@/database/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertReleaseSchema = createInsertSchema(releases);
const selectReleaseSchema = createSelectSchema(releases);

export const createReleaseSchema = insertReleaseSchema.omit({
  id: true,
  createdAt: true,
  modifiedAt: true,
  workspaceId: true,
});

export const deleteReleaseSchema = selectReleaseSchema.pick({ id: true });

export const createReleaseStrategySchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).optional(),
});

export const deleteReleaseStrategySchema = z.object({
  id: z.string(),
});
