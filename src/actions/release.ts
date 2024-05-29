'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';
import {
  createReleaseSchema,
  createReleaseStrategySchema,
  deleteReleaseSchema,
  deleteReleaseStrategySchema,
} from '@/validation/release';
import { revalidatePath } from 'next/cache';

export const createReleaseAction = workspaceAction(
  createReleaseSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createReleaseAction' });

    logger.debug({ input }, 'Creating release strategy');

    const releaseService = get(ReleaseService);
    const release = await releaseService.create(input);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { release, success: true };
  },
);

export const deleteReleaseAction = workspaceAction(
  deleteReleaseSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteReleaseAction' });

    logger.debug({ input }, 'Deleting release');

    const releaseService = get(ReleaseService);

    await releaseService.delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));
  },
);

export const createReleaseStrategyAction = workspaceAction(
  createReleaseStrategySchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createReleaseStrategyAction' });

    logger.debug({ input }, 'Creating release strategy');

    const releaseStrategiesService = get(ReleaseStrategiesService);
    const releaseStrategy = await releaseStrategiesService.create(input);

    const { slug } = context.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { releaseStrategy, success: true };
  },
);

export const deleteReleaseStrategyAction = workspaceAction(
  deleteReleaseStrategySchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteReleaseStrategyAction' });

    logger.debug({ input }, 'Deleting release strategy');

    const releaseStrategiesService = get(ReleaseStrategiesService);

    await releaseStrategiesService.delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));
  },
);
