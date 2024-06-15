import { appConfig } from '@/config/app';
export const StorageKeys = {
  COOKIE_STORAGE_PREFIX: 'versioning.app',
  REQUEST_ID_HEADER_KEY: 'x-request-id',
  WORKSPACE_COOKIE_KEY: `${appConfig.name}:workspace`,
} as const;

export const DEFAULT_DB_CACHE_MS = 30 * 1000; // 30 seconds

export const API_KEY_HEADER = 'x-api-key';
