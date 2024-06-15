import { LoggerContext, getLogger, getRequestId } from '@/lib/logger';
import { headers } from 'next/headers';

export const serverLogger = (context?: LoggerContext) => {
  const requestId = getRequestId(headers());
  return getLogger({ ...context, requestId });
};
