import { z } from 'zod';

export const createComponentSchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).optional(),
});

export const deleteComponentSchema = z.object({
  id: z.string(),
});
