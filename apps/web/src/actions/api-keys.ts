'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ApiKeysService } from '@/services/api-keys.service';
import { get } from '@/services/service-factory';
import { createApiKeySchema, deleteApiKeySchema } from '@/validation/api-keys';
import { revalidatePath } from 'next/cache';

export const createApiKeyAction = workspaceAction(
  createApiKeySchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createApiKeyAction' });

    logger.debug({ input }, 'Creating API Key');

    const resource = await get(ApiKeysService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS));

    return { resource, success: true };
  },
);

export const deleteApiKeyAction = workspaceAction(
  deleteApiKeySchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteApiKeyAction' });

    logger.debug({ input }, 'Deleting API Key');

    await get(ApiKeysService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS));

    return { success: true };
  },
);
