import { StorageKeys } from '@/config/storage';
import { ErrorCode } from '@/lib/error/error-codes';

export interface AppErrorContext extends Record<string, unknown> {
  requestId: string;
}

export interface AppErrorJson {
  message: string;
  code: ErrorCode['type'];
  context: AppErrorContext;
}

export class AppError extends Error {
  public constructor(
    message: string,
    public readonly errorCode: ErrorCode,
    public readonly context?: Omit<AppErrorContext, 'requestId'> & {
      requestId?: never;
    },
  ) {
    super(message);
  }

  public toJSON(): AppErrorJson {
    return {
      message: this.message,
      code: this.errorCode.type,
      context: {
        ...this.context,
        requestId: 'TODO: add request due to headers() being async',
      },
    };
  }

  public toResponse(): Response {
    const asJson = this.toJSON();
    const { hideContext, ...context } = asJson.context || {};

    return new Response(
      JSON.stringify({
        error: {
          ...asJson,
          context: hideContext ? undefined : context,
        },
      }),
      {
        status: this.errorCode.statusCode,
        headers: {
          'Content-Type': 'application/json',
          [StorageKeys.REQUEST_ID_HEADER_KEY]: asJson.context.requestId,
        },
      },
    );
  }
}
