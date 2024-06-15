import { AppErrorJson } from '@/lib/error/app.error';

export const parseServerError = (error: string): AppErrorJson => {
  try {
    const parsed = JSON.parse(error);
    return parsed as AppErrorJson;
  } catch {
    return {
      message: error,
      code: 'UNHANDLED_ERROR',
      context: { requestId: 'unknown' },
    };
  }
};
