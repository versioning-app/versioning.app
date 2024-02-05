import { ErrorCodes } from '@/lib/error/error-codes';
import { getRequestId } from '@/lib/logger';
import { headers } from 'next/headers';

export interface AppErrorContext extends Record<string, unknown> {
  requestId: string;
}

export interface AppErrorJson {
  message: string;
  code: keyof typeof ErrorCodes;
  context: AppErrorContext;
}

export class AppError extends Error {
  public constructor(
    message: string,
    public readonly code: keyof typeof ErrorCodes,
    public readonly context?: Omit<AppErrorContext, 'requestId'> & {
      requestId?: never;
    }
  ) {
    super(message);
  }

  public toJSON(): AppErrorJson {
    return {
      message: this.message,
      code: this.code,
      context: { ...this.context, requestId: getRequestId(headers()) },
    };
  }
}
