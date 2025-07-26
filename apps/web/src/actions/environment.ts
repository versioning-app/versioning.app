'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { EnvironmentsService } from '@/services/environments.service';
import { get } from '@/services/service-factory';
import {
  createEnvironmentSchema,
  createEnvironmentTypeSchema,
  deleteEnvironmentSchema,
} from '@/validation/environment';
import { revalidatePath } from 'next/cache';

export const createEnvironmentTypeAction = workspaceAction
  .schema(createEnvironmentTypeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createEnvironmentType' });

    logger.debug({ parsedInput }, 'Creating environment type');

    const resource = await get(EnvironmentTypesService).create(parsedInput);

    const { slug } = ctx.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { resource, success: true };
  });

export const deleteEnvironmentTypeAction = workspaceAction
  .schema(deleteEnvironmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteEnvironmentType' });

    logger.debug({ parsedInput }, 'Deleting environment type');

    await get(EnvironmentTypesService).delete(parsedInput.id);

    const { slug } = ctx.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { success: true };
  });

export const createEnvironmentAction = workspaceAction
  .schema(createEnvironmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createEnvironmentAction' });

    logger.debug({ parsedInput }, 'Creating environment');

    const resource = await get(EnvironmentsService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { resource, success: true };
  });

export const deleteEnvironmentAction = workspaceAction
  .schema(deleteEnvironmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteEnvironmentAction' });

    logger.debug({ parsedInput }, 'Deleting environment');

    await get(EnvironmentsService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { success: true };
  });
