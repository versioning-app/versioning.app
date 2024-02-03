import { LoggerContext, getCorrelationId, getLogger } from '@/lib/logger';
import { headers } from 'next/headers';

export const serverLogger = (context?: LoggerContext) => {
  const correlationId = getCorrelationId(headers());
  return getLogger({ ...context, correlationId });
};
