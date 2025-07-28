import { fieldConfig } from '@/components/ui/autoform';
import { z } from 'zod';

export const changeSlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .superRefine(
      fieldConfig({
        inputProps: {
          placeholder: 'New slug',
        },
      }),
    )
    .describe('Slug for the current workspace'),
});
