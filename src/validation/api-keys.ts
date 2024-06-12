import { api_keys } from '@/database/schema';
import { DEFAULT_OMITTED_FIELDS } from '@/validation/defaults';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const insertApiKey = createInsertSchema(api_keys);
const selectApiKey = createSelectSchema(api_keys);

export const createApiKeySchema = insertApiKey.omit({
  ...DEFAULT_OMITTED_FIELDS,
  key: true,
});

export const deleteApiKeySchema = selectApiKey.pick({
  id: true,
});
