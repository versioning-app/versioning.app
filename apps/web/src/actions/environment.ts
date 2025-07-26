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
  .inputSchema(createEnvironmentTypeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createEnvironmentType' });

    logger.debug({ parsedInput }, 'Creating environment type');

    const environmentTypesService = await get(EnvironmentTypesService);
    const resource = await environmentTypesService.create(parsedInput);

    const { slug } = ctx.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { resource, success: true };
  });

export const deleteEnvironmentTypeAction = workspaceAction
  .inputSchema(deleteEnvironmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteEnvironmentType' });

    logger.debug({ parsedInput }, 'Deleting environment type');

    const environmentTypesService = await get(EnvironmentTypesService);
    await environmentTypesService.delete(parsedInput.id);

    const { slug } = ctx.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { success: true };
  });

export const createEnvironmentAction = workspaceAction
  .inputSchema(createEnvironmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createEnvironmentAction' });

    logger.debug({ parsedInput }, 'Creating environment');

    const environmentsService = await get(EnvironmentsService);
    const resource = await environmentsService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { resource, success: true };
  });

export const deleteEnvironmentAction = workspaceAction
  .inputSchema(deleteEnvironmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteEnvironmentAction' });

    logger.debug({ parsedInput }, 'Deleting environment');

    const environmentsService = await get(EnvironmentsService);
    await environmentsService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { success: true };
  });
