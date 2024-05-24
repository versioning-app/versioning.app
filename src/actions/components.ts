'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ComponentsService } from '@/services/components.service';
import { get } from '@/services/service-factory';
import {
  createComponentSchema,
  deleteComponentSchema,
} from '@/validation/component';
import { revalidatePath } from 'next/cache';

export const createComponentAction = workspaceAction(
  createComponentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createComponentAction' });

    logger.debug({ input }, 'Creating component');

    const component = get(ComponentsService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { component, success: true };
  },
);

export const deleteComponentAction = workspaceAction(
  deleteComponentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteComponentAction' });

    logger.debug({ input }, 'Deleting component');

    await get(ComponentsService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { success: true };
  },
);
