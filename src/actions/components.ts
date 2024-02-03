import { z } from 'zod';

const createComponentSchema = z.object({
  name: z.string().max(42),
  description: z.string().max(255).optional(),
});

// export const createComponentAction = action(
//   createComponentSchema,
//   // (input, context) => {}
// );
