import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  priceId: z.string(),
});
