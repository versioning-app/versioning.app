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

export const createReleaseAction = workspaceAction
  .schema(createReleaseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createReleaseAction' });

    logger.debug({ parsedInput }, 'Creating release');

    const resource = await get(ReleaseService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASES));

    return { resource, success: true };
  });

export const deleteReleaseAction = workspaceAction
  .schema(deleteReleaseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteReleaseAction' });

    logger.debug({ parsedInput }, 'Deleting release');

    await get(ReleaseService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASES));

    return { success: true };
  });

export const createReleaseStrategyAction = workspaceAction
  .schema(createReleaseStrategySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createReleaseStrategyAction' });

    logger.debug({ parsedInput }, 'Creating release strategy');

    const resource = await get(ReleaseStrategiesService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { resource, success: true };
  });

export const deleteReleaseStrategyAction = workspaceAction
  .schema(deleteReleaseStrategySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteReleaseStrategyAction' });

    logger.debug({ parsedInput }, 'Deleting release strategy');

    await get(ReleaseStrategiesService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { success: true };
  });

export const createReleaseStrategyStepAction = workspaceAction
  .schema(createReleaseStrategyStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createReleaseStrategyStepAction' });

    logger.debug({ parsedInput }, 'Creating release strategy step');

    const resource = await get(ReleaseStrategyStepService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS),
    );

    return { resource, success: true };
  });

export const deleteReleaseStrategyStepAction = workspaceAction
  .schema(deleteReleaseStrategyStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteReleaseStrategyStepAction' });

    logger.debug({ parsedInput }, 'Deleting release strategy step');

    await get(ReleaseStrategyStepService).delete(parsedInput.id);

    const { slug } = ctx.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS),
    );

    return { success: true };
  });

export const createReleaseStepAction = workspaceAction
  .schema(createReleaseStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'createReleaseStepAction' });

    logger.debug({ parsedInput }, 'Creating release step');

    const resource = await get(ReleaseStepService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS));

    return { resource, success: true };
  });

export const deleteReleaseStepAction = workspaceAction
  .schema(deleteReleaseStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = serverLogger({ name: 'deleteReleaseStepAction' });

    logger.debug({ parsedInput }, 'Deleting release step');

    await get(ReleaseStepService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS));

    return { success: true };
  });
