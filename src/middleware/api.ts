'use server';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { serverLogger } from '@/lib/logger/server';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { NextRequest, NextResponse } from 'next/server';

export const apiMiddleware = async (req: NextRequest) => {
  const logger = serverLogger({ source: 'apiMiddleware' });

  const now = new Date();
  logger.debug({ now }, 'API middleware started');

  try {
    const workspaces = await get(WorkspaceService).currentWorkspaceId();

    logger.debug({ workspaces }, 'Current workspace ID');

    return NextResponse.next();
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
