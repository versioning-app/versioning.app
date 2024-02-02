import { getCorrelationId, getLogger } from '@/lib/logger';
import { headers } from 'next/headers';

export const serverLogger = () => {
  let logger = getLogger();

  try {
    const correlationId = getCorrelationId(headers());
    logger = logger.child({ correlationId });
  } catch {
    logger.warn('Failed to set correlationId in logger context.');
  }

  return logger;
};
