import { z } from 'zod';

export const registerInterestSchema = z.object({
  email: z.string().email(),
  captcha: z.string().optional(),
});
