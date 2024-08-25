import { StorageKeys } from '@/config/storage';
import { generateRequestId } from '@/lib/utils';
import pinoLogger from 'pino';
import safeStringify from 'fast-safe-stringify';

// let logger: Logger;

export type LoggerContext = {
  source?: string;
  requestId?: string;
} & Record<string, unknown>;

export const getLogger = (context?: LoggerContext) => {
  const logLevel = process.env.APP_LOG_LEVEL || 'info';
  let logger = pinoLogger({
    level: logLevel,
    browser: {
      write: (o) => console.log(safeStringify(o)),
    },
  });

  if (context) {
    logger = logger.child(context);
  }

  return logger;
};

export const getRequestId = (headers: Headers) => {
  let requestId = headers.get(StorageKeys.REQUEST_ID_HEADER_KEY);

  if (!requestId) {
    requestId = generateRequestId();
  }

  return requestId;
};
