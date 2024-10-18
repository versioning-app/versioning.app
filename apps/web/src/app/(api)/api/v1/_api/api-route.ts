import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { serverLogger } from '@/lib/logger/server';
import { NextRequest, NextResponse } from 'next/server';

export const apiRoute = async (
  request: NextRequest,
  route: (request: NextRequest) => Promise<any>,
  successStatusCode = 200,
) => {
  const logger = serverLogger({ source: request.url });

  logger.debug({ request }, 'API route');

  try {
    return NextResponse.json(
      { data: await route(request) },
      { status: successStatusCode },
    );
  } catch (error) {
    console.log(error);
    let serverError: AppError = error as AppError;

    if (!(serverError instanceof AppError)) {
      logger.error({ error }, 'Internal server error during API middleware');
      serverError = new AppError(
        'Internal server error',
        ErrorCodes.UNHANDLED_ERROR,
      );
    }

    const response = NextResponse.json(
      { error: { ...serverError.toJSON() } },
      {
        status: serverError.errorCode.statusCode,
      },
    );

    response.headers.set('x-error-code', serverError.errorCode.type);

    return response;
  }
};
