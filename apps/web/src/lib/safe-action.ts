import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { getLogger, getRequestId } from '@/lib/logger';
import { serverLogger } from '@/lib/logger/server';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';

const handleReturnedServerError = async (e: Error) => {
  if (e instanceof AppError) {
    return JSON.stringify(e.toJSON());
  }

  // Otherwise return default error message.
  return JSON.stringify({
    message:
      'Something went wrong executing this operation. Please contact support if the problem persists.',
    code: ErrorCodes.UNHANDLED_ERROR,
    context: {
      requestId: getRequestId(await headers()),
    },
  });
};

export const action = createSafeActionClient({
  // You can provide a custom log Promise, otherwise the lib will use `console.error`
  // as the default logging system. If you want to disable server errors logging,
  // just pass an empty Promise.
  handleServerError: async (e) => {
    getLogger().error(e);
    return handleReturnedServerError(e);
  },
});

export const actionClient = createSafeActionClient({
  handleServerError: async (e) => {
    const logger = await serverLogger({ name: 'workspaceAction' });
    const { message, ...errorMeta } =
      e instanceof AppError ? e.toJSON() : { message: e.message };
    logger.error(errorMeta, message);

    return handleReturnedServerError(e);
  },
});

export const workspaceAction = actionClient.use(async ({ next, ctx }) => {
  const workspaceService = await get(WorkspaceService);
  const workspace = await workspaceService.currentWorkspace();

  if (!workspace) {
    throw new AppError('No workspace found', ErrorCodes.WORKSPACE_NOT_FOUND);
  }

  return next({ ctx: { workspace } });
});
