import { LoggerContext, getLogger, getRequestId } from '@/lib/logger';
import { headers } from 'next/headers';
import { type AppHeaders } from '@/types/headers';

export const serverLogger = async (context?: LoggerContext) =>
  serverLoggerWithHeaders(await headers(), context);

export const serverLoggerWithHeaders = (
  headers: AppHeaders,
  context?: LoggerContext,
) => {
  const requestId = getRequestId(headers);
  return getLogger({ ...context, requestId });
};
