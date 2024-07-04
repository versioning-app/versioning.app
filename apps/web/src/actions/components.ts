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
  .schema(createComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createComponentAction' });

    logger.debug({ parsedInput }, 'Creating component');

    const resource = await get(ComponentsService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { resource, success: true };
  });

export const deleteComponentAction = workspaceAction
  .schema(deleteComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteComponentAction' });

    logger.debug({ parsedInput }, 'Deleting component');

    await get(ComponentsService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));

    return { success: true };
  });

export const createComponentVersionAction = workspaceAction
  .schema(createComponentVersionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createComponentVersionAction' });

    logger.debug({ parsedInput }, 'Creating component version');

    const resource = await get(ComponentVersionService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_COMPONENT_VERSIONS),
    );

    return { resource, success: true };
  });

export const deleteComponentVersionAction = workspaceAction
  .schema(deleteComponentVersionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteComponentVersionAction' });

    logger.debug({ parsedInput }, 'Deleting component version');

    await get(ComponentVersionService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_COMPONENT_VERSIONS),
    );

    return { success: true };
  });

export const createReleaseComponentAction = workspaceAction
  .schema(createReleaseComponentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createReleaseComponentAction' });

    logger.debug({ parsedInput }, 'Creating component version');

    const resource = await get(ReleaseComponentService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_COMPONENTS),
    );

    return { resource, success: true };
  });
