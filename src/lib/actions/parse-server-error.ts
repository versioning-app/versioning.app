import { AppErrorJson } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';

export const parseServerError = (error: string): AppErrorJson => {
  try {
    const parsed = JSON.parse(error);
    return parsed as AppErrorJson;
  } catch {
    return {
      message: error,
      code: ErrorCodes.UNHANDLED_ERROR,
      context: { requestId: 'unknown' },
    };
  }
};
