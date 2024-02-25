'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ComponentsService } from '@/services/components.service';
import { ServiceFactory } from '@/services/service-factory';
import {
  createComponentSchema,
  deleteComponentSchema,
} from '@/validation/component';
import { revalidatePath } from 'next/cache';

export const createComponentAction = workspaceAction(
  createComponentSchema,
  async (input, context) => {
    const logger = serverLogger({ source: 'createComponentAction' });

    logger.debug({ input }, 'Creating component');

    const componentsService = ServiceFactory.get(ComponentsService);
    const component = await componentsService.createComponent(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { component, success: true };
  },
);

export const deleteComponentAction = workspaceAction(
  deleteComponentSchema,
  async (input, context) => {
    const logger = serverLogger({ source: 'deleteComponentAction' });

    logger.debug({ input }, 'Deleting component');

    const componentsService = ServiceFactory.get(ComponentsService);
    await componentsService.deleteComponent(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));
  },
);
