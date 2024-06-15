import { buildNeonClient } from '@/database/client';
import { drizzleLogger } from '@/database/logger';
import * as schema from '@/database/schema';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = buildNeonClient(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema, logger: drizzleLogger });
