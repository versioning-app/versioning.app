'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { EnvironmentsService } from '@/services/environments.service';
import { ServiceFactory } from '@/services/service-factory';
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

    const environmentsService = ServiceFactory.get(EnvironmentsService);
    const environmentType =
      await environmentsService.createEnvironmentType(input);

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

    const environmentsService = ServiceFactory.get(EnvironmentsService);

    await environmentsService.deleteEnvironmentType(input.id);

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

    const environmentsService = ServiceFactory.get(EnvironmentsService);
    const environment = await environmentsService.createEnvironment(input);

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

    const environmentsService = ServiceFactory.get(EnvironmentsService);

    await environmentsService.deleteEnvironment(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));
  },
);
