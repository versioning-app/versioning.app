import type { Config } from 'drizzle-kit';

export default {
  schema: ['src/database/schema/index.ts'],
  out: 'src/database/migrations',
} satisfies Config;
