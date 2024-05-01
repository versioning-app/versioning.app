import * as schema from '@/database/schema';
import { drizzle } from 'drizzle-orm/neon-http';

import { buildNeonClient } from '@/database/client';

const sql = buildNeonClient(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
