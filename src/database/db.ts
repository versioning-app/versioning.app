import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL ?? process.env.DRIZZLE_DATABASE_URL!);

export const db = drizzle(sql);
