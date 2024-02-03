import { getLogger } from '@/lib/logger';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { DEFAULT_SERVER_ERROR, createSafeActionClient } from 'next-safe-action';

export class ActionError extends Error {}

const handleReturnedServerError = (e: Error) => {
  // If the error is an instance of `ActionError`, unmask the message.
  if (e instanceof ActionError) {
    return e.message;
  }

  // Otherwise return default error message.
  return DEFAULT_SERVER_ERROR;
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
    const workspace = await ServiceFactory.get(
      WorkspaceService
    ).currentWorkspace();

    if (!workspace) {
      throw new ActionError('No workspace found');
    }

    return workspace;
  },
  handleServerErrorLog: (e) => {
    getLogger().error(e);
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
