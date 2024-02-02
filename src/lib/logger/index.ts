import { Storage } from '@/config/storage';
import pinoLogger, { Logger } from 'pino';

let logger: Logger;
export const getLogger = () => {
  if (!logger) {
    const logLevel = process.env.APP_LOG_LEVEL || 'info';
    logger = pinoLogger({
      level: logLevel,
    });
  }

  return logger;
};

export const getCorrelationId = (headers: Headers) => {
  let correlationId = headers.get(Storage.CORRELATION_ID_HEADER_KEY);

  if (!correlationId) {
    correlationId = crypto.randomUUID();
  }

  return correlationId;
};
