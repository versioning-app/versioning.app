import { z } from 'zod';

export const changeSlugSchema = z.object({
  slug: z.string().toLowerCase().min(3).max(32),
});
