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

    const environmentTypesService = get(EnvironmentTypesService);

    const environmentType = await environmentTypesService.create(input);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );

    return { environmentType, success: true };
  },
);

export const deleteEnvironmentTypeAction = workspaceAction(
  deleteEnvironmentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteEnvironmentType' });

    logger.debug({ input }, 'Deleting environment type');

    const environmentTypesService = get(EnvironmentTypesService);

    await environmentTypesService.delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES),
    );
  },
);

export const createEnvironmentAction = workspaceAction(
  createEnvironmentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createEnvironmentAction' });

    logger.debug({ input }, 'Creating environment');

    const environmentsService = get(EnvironmentsService);
    const environment = await environmentsService.create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { environment, success: true };
  },
);

export const deleteEnvironmentAction = workspaceAction(
  deleteEnvironmentSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteEnvironmentAction' });

    logger.debug({ input }, 'Deleting environment');

    const environmentsService = get(EnvironmentsService);

    await environmentsService.delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));
  },
);
