import { StorageKeys } from '@/config/storage';
import { generateRequestId } from '@/lib/utils';
import pinoLogger, { Logger } from 'pino';

let logger: Logger;

export type LoggerContext = {
  source?: string;
  requestId?: string;
} & Record<string, unknown>;

export const getLogger = (context?: LoggerContext) => {
  if (!logger) {
    const logLevel = process.env.APP_LOG_LEVEL || 'info';
    logger = pinoLogger({
      level: logLevel,
    });
  }

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
