import { z } from 'zod';

export const createReleaseStrategySchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).optional(),
});

export const deleteReleaseStrategySchema = z.object({
  id: z.string(),
});
