import { NeonQueryFunction, neon } from '@neondatabase/serverless';

import { neonConfig } from '@neondatabase/serverless';

neonConfig.fetchEndpoint = (host) => {
  const offlineProxy = process.env.USE_OFFLINE_DATABASE === 'true';
  const protocol =
    process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
      ? 'https'
      : offlineProxy
        ? 'http'
        : 'https';
  const port = offlineProxy ? 4444 : 443;
  return `${protocol}://${host}:${port}/sql`;
};

export const buildNeonClient = (
  databaseUrl: string,
): NeonQueryFunction<false, false> => {
  return neon(databaseUrl);
};
