'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ReleaseStepService } from '@/services/release-steps.service';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';
import {
  createReleaseSchema,
  createReleaseStepSchema,
  createReleaseStrategySchema,
  createReleaseStrategyStepSchema,
  deleteReleaseSchema,
  deleteReleaseStepSchema,
  deleteReleaseStrategySchema,
  deleteReleaseStrategyStepSchema,
} from '@/validation/release';
import { revalidatePath } from 'next/cache';

export const createReleaseAction = workspaceAction(
  createReleaseSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createReleaseAction' });

    logger.debug({ input }, 'Creating release');

    const resource = await get(ReleaseService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASES));

    return { resource, success: true };
  },
);

export const deleteReleaseAction = workspaceAction(
  deleteReleaseSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteReleaseAction' });

    logger.debug({ input }, 'Deleting release');

    await get(ReleaseService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASES));

    return { success: true };
  },
);

export const createReleaseStrategyAction = workspaceAction(
  createReleaseStrategySchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createReleaseStrategyAction' });

    logger.debug({ input }, 'Creating release strategy');

    const resource = await get(ReleaseStrategiesService).create(input);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { resource, success: true };
  },
);

export const deleteReleaseStrategyAction = workspaceAction(
  deleteReleaseStrategySchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteReleaseStrategyAction' });

    logger.debug({ input }, 'Deleting release strategy');

    await get(ReleaseStrategiesService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { success: true };
  },
);

export const createReleaseStrategyStepAction = workspaceAction(
  createReleaseStrategyStepSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createReleaseStrategyStepAction' });

    logger.debug({ input }, 'Creating release strategy step');

    const resource = await get(ReleaseStrategyStepService).create(input);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS),
    );

    return { resource, success: true };
  },
);

export const deleteReleaseStrategyStepAction = workspaceAction(
  deleteReleaseStrategyStepSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteReleaseStrategyStepAction' });

    logger.debug({ input }, 'Deleting release strategy step');

    await get(ReleaseStrategyStepService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS),
    );

    return { success: true };
  },
);

export const createReleaseStepAction = workspaceAction(
  createReleaseStepSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createReleaseStepAction' });

    logger.debug({ input }, 'Creating release step');

    const resource = await get(ReleaseStepService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS));

    return { resource, success: true };
  },
);

export const deleteReleaseStepAction = workspaceAction(
  deleteReleaseStepSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteReleaseStepAction' });

    logger.debug({ input }, 'Deleting release step');

    await get(ReleaseStepService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS));

    return { success: true };
  },
);
