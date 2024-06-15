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

export const createEnvironmentTypeAction = workspaceAction(
  createEnvironmentTypeSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createEnvironmentType' });

    logger.debug({ input }, 'Creating environment type');

    const resource = await get(EnvironmentTypesService).create(input);

    const { slug } = context.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { resource, success: true };
  },
);

export const deleteEnvironmentTypeAction = workspaceAction(
  deleteEnvironmentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteEnvironmentType' });

    logger.debug({ input }, 'Deleting environment type');

    await get(EnvironmentTypesService).delete(input.id);

    const { slug } = context.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { success: true };
  },
);

export const createEnvironmentAction = workspaceAction(
  createEnvironmentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createEnvironmentAction' });

    logger.debug({ input }, 'Creating environment');

    const resource = await get(EnvironmentsService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { resource, success: true };
  },
);

export const deleteEnvironmentAction = workspaceAction(
  deleteEnvironmentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteEnvironmentAction' });

    logger.debug({ input }, 'Deleting environment');

    await get(EnvironmentsService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { success: true };
  },
);
