import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

async function runMigrate() {
  if (!databaseUrl) {
    throw new AppError(
      'DATABASE_URL is not defined',
      ErrorCodes.INTERNAL_MISCONFIGURATION
    );
  }

  const sql = neon(databaseUrl);

  const db = drizzle(sql);

  console.log('Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: 'src/database/migrations' });
  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
