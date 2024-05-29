import { component_versions } from '@/database/schema';
import { DEFAULT_OMITTED_FIELDS } from '@/validation/defaults';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const createComponentSchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).optional(),
});

export const deleteComponentSchema = z.object({
  id: z.string(),
});

const insertComponentVersion = createInsertSchema(component_versions);
const selectComponentVersion = createSelectSchema(component_versions);

export const createComponentVersionSchema = insertComponentVersion.omit(
  DEFAULT_OMITTED_FIELDS,
);

export const deleteComponentVersionSchema = selectComponentVersion.pick({
  id: true,
});
