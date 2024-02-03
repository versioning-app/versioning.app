import { StorageKeys } from '@/config/storage';
import pinoLogger, { Logger } from 'pino';

let logger: Logger;

export type LoggerContext = {
  source?: string;
  correlationId?: string;
} & Record<string, unknown>;

export const getLogger = (context?: LoggerContext) => {
  if (!logger) {
    const logLevel = process.env.APP_LOG_LEVEL || 'info';
    logger = pinoLogger({
      level: logLevel,
      browser: {
        write: (o) => console.log(JSON.stringify(o)),
      },
    });
  }

  if (context) {
    logger = logger.child(context);
  }

  return logger;
};

export const getCorrelationId = (headers: Headers) => {
  let correlationId = headers.get(StorageKeys.CORRELATION_ID_HEADER_KEY);

  if (!correlationId) {
    correlationId = crypto.randomUUID();
  }

  return correlationId;
};
