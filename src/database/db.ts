import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { neonConfig } from '@neondatabase/serverless';

if (process.env.USE_OFFLINE_DATABASE) {
  // https://github.com/neondatabase/serverless/issues/33
  // https://github.com/TimoWilhelm/local-neon-http-proxy
  neonConfig.fetchEndpoint = (host) =>
    `https://${host}:${host === 'db.localtest.me' ? 4444 : 443}/sql`;
}

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);
