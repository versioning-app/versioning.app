'use server';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { serverLogger } from '@/lib/logger/server';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const apiMiddleware = async (req: NextRequest) => {
  const logger = serverLogger({ source: 'apiMiddleware' });

  const now = new Date();
  logger.debug({ now }, 'API middleware started');

  try {
    const workspaceId = await get(WorkspaceService).currentWorkspaceId();

    logger.debug({ workspaceId }, 'Current workspace ID');

    const next = NextResponse.next();

    next.headers.set('Cache-Control', 'no-store');
    next.headers.set('x-workspace-id', workspaceId);
    next.headers.set('x-request-id', headers().get('x-request-id') || '');
    next.headers.set('x-api-version', '1');

    return next;
  } catch (error) {
    let serverError: AppError = error as AppError;

    if (!(serverError instanceof AppError)) {
      logger.error({ error }, 'Internal server error during API middleware');
      serverError = new AppError(
        'Internal server error',
        ErrorCodes.UNHANDLED_ERROR,
      );
    }

    return NextResponse.json(serverError.toJSON(), {
      status: serverError.errorCode.statusCode,
    });
  } finally {
    const elapsed = new Date().getTime() - now.getTime();
    logger.debug({ elapsed }, 'API middleware completed');
  }
};
