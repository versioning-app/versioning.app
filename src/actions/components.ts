'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ComponentVersionService } from '@/services/component-version.service';
import { ComponentsService } from '@/services/components.service';
import { get } from '@/services/service-factory';
import {
  createComponentSchema,
  createComponentVersionSchema,
  deleteComponentSchema,
  deleteComponentVersionSchema,
} from '@/validation/component';
import { revalidatePath } from 'next/cache';

export const createComponentAction = workspaceAction(
  createComponentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createComponentAction' });

    logger.debug({ input }, 'Creating component');

    const component = await get(ComponentsService).create(input);

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

export const createComponentVersionAction = workspaceAction(
  createComponentVersionSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createComponentVersionAction' });

    logger.debug({ input }, 'Creating component version');

    const resource = await get(ComponentVersionService).create(input);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_COMPONENT_VERSIONS),
    );

    return { resource, success: true };
  },
);

export const deleteComponentVersionAction = workspaceAction(
  deleteComponentVersionSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteComponentVersionAction' });

    logger.debug({ input }, 'Deleting component version');

    await get(ComponentVersionService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { success: true };
  },
);
