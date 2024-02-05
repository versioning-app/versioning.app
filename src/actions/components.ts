'use server';
import { Navigation } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ComponentsService } from '@/services/components.service';
import { ServiceFactory } from '@/services/service-factory';
import {
  createComponentSchema,
  deleteComponentSchema,
} from '@/validation/component';
import { revalidatePath } from 'next/cache';

// export const createComponentAction = action(
//   createComponentSchema,
//   // (input, context) => {}
// );

export const createComponentAction = workspaceAction(
  createComponentSchema,
  async (input) => {
    const logger = serverLogger({ source: 'createComponentAction' });

    logger.debug({ input }, 'Creating component');

    const componentsService = ServiceFactory.get(ComponentsService);
    const component = await componentsService.createComponent(input);
    revalidatePath(Navigation.DASHBOARD_COMPONENTS);

    return component;
  }
);

export const deleteComponentAction = workspaceAction(
  deleteComponentSchema,
  async (input) => {
    const logger = serverLogger({ source: 'deleteComponentAction' });

    logger.debug({ input }, 'Deleting component');

    const componentsService = ServiceFactory.get(ComponentsService);
    await componentsService.deleteComponent(input.componentId);
    revalidatePath(Navigation.DASHBOARD_COMPONENTS);
  }
);
