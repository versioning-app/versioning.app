import { getCorrelationId, getLogger } from '@/lib/logger';
import { headers } from 'next/headers';

export const serverLogger = () => {
  const logger = getLogger();

  try {
    const correlationId = getCorrelationId(headers());
    logger.child({ correlationId });
  } catch {
    logger.warn('Failed to set correlationId in logger context.');
  }

  return logger;
};
