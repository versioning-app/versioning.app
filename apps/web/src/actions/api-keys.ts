'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ApiKeysService } from '@/services/api-keys.service';
import { get } from '@/services/service-factory';
import { createApiKeySchema, deleteApiKeySchema } from '@/validation/api-keys';
import { revalidatePath } from 'next/cache';

export const createApiKeyAction = workspaceAction
  .schema(createApiKeySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createApiKeyAction' });

    logger.debug({ parsedInput }, 'Creating API Key');

    const resource = await get(ApiKeysService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS));

    return { resource, success: true };
  });

export const deleteApiKeyAction = workspaceAction
  .schema(deleteApiKeySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteApiKeyAction' });

    logger.debug({ parsedInput }, 'Deleting API Key');

    await get(ApiKeysService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS));

    return { success: true };
  });
