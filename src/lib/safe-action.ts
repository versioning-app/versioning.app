import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { getLogger, getRequestId } from '@/lib/logger';
import { serverLogger } from '@/lib/logger/server';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';

const handleReturnedServerError = (e: Error) => {
  if (e instanceof AppError) {
    return JSON.stringify(e.toJSON());
  }

  // Otherwise return default error message.
  return JSON.stringify({
    message:
      'Something went wrong executing this operation. Please contact support if the problem persists.',
    code: ErrorCodes.UNHANDLED_ERROR,
    context: {
      requestId: getRequestId(headers()),
    },
  });
};

export const action = createSafeActionClient({
  // You can provide a custom log Promise, otherwise the lib will use `console.error`
  // as the default logging system. If you want to disable server errors logging,
  // just pass an empty Promise.
  handleServerErrorLog: (e) => {
    getLogger().error(e);
  },
  handleReturnedServerError,
});

export const workspaceAction = createSafeActionClient({
  middleware: async () => {
    const workspace =
      await ServiceFactory.get(WorkspaceService).currentWorkspace();

    if (!workspace) {
      throw new AppError('No workspace found', ErrorCodes.WORKSPACE_NOT_FOUND);
    }

    return { workspace };
  },
  handleServerErrorLog: (e) => {
    const logger = serverLogger({ name: 'workspaceAction' });
    const { message, ...errorMeta } =
      e instanceof AppError ? e.toJSON() : { message: e.message };
    logger.error(errorMeta, message);
  },
  handleReturnedServerError,
});

// export const authAction = createSafeActionClient({
//   // You can provide a middleware function. In this case, context is used
//   // for (fake) auth purposes.
//   middleware(parsedInput) {
//     const userId = randomUUID();

//     console.log(
//       'HELLO FROM ACTION MIDDLEWARE, USER ID:',
//       userId,
//       'PARSED INPUT:',
//       parsedInput
//     );

//     return userId;
//   },
//   handleReturnedServerError,
// });
