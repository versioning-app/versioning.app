'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ComponentVersionService } from '@/services/component-version.service';
import { ComponentsService } from '@/services/components.service';
import { ReleaseComponentService } from '@/services/release-component.service';
import { get } from '@/services/service-factory';
import {
  createComponentSchema,
  createComponentVersionSchema,
  createReleaseComponentSchema,
  deleteComponentSchema,
  deleteComponentVersionSchema,
} from '@/validation/component';
import { revalidatePath } from 'next/cache';

export const createComponentAction = workspaceAction
  .inputSchema(createComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createComponentAction' });

    logger.debug({ parsedInput }, 'Creating component');

    const componentsService = await get(ComponentsService);
    const resource = await componentsService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { resource, success: true };
  });

export const deleteComponentAction = workspaceAction
  .inputSchema(deleteComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteComponentAction' });

    logger.debug({ parsedInput }, 'Deleting component');

    const componentsService = await get(ComponentsService);
    await componentsService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { success: true };
  });

export const createComponentVersionAction = workspaceAction
  .inputSchema(createComponentVersionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createComponentVersionAction' });

    logger.debug({ parsedInput }, 'Creating component version');

    const componentVersionService = await get(ComponentVersionService);
    const resource = await componentVersionService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_COMPONENT_VERSIONS),
    );

    return { resource, success: true };
  });

export const deleteComponentVersionAction = workspaceAction
  .inputSchema(deleteComponentVersionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteComponentVersionAction' });

    logger.debug({ parsedInput }, 'Deleting component version');

    const componentVersionService = await get(ComponentVersionService);
    await componentVersionService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_COMPONENT_VERSIONS),
    );

    return { success: true };
  });

export const createReleaseComponentAction = workspaceAction
  .inputSchema(createReleaseComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createReleaseComponentAction' });

    logger.debug({ parsedInput }, 'Creating component version');

    const releaseComponentService = await get(ReleaseComponentService);
    const resource = await releaseComponentService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_COMPONENTS),
    );

    return { resource, success: true };
  });
