'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ApiKeysService } from '@/services/api-keys.service';
import { get } from '@/services/service-factory';
import { createApiKeySchema, deleteApiKeySchema } from '@/validation/api-keys';
import { revalidatePath } from 'next/cache';

export const createApiKeyAction = workspaceAction
  .inputSchema(createApiKeySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createApiKeyAction' });
    logger.debug({ parsedInput }, 'Creating API Key');
    const apiKeysService = await get(ApiKeysService);
    const resource = await apiKeysService.create(parsedInput);
    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS));
    return { resource, success: true };
  });

export const deleteApiKeyAction = workspaceAction
  .inputSchema(deleteApiKeySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteApiKeyAction' });
    logger.debug({ parsedInput }, 'Deleting API Key');
    const apiKeysService = await get(ApiKeysService);
    await apiKeysService.delete(parsedInput.id);
    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS));
    return { success: true };
  });
