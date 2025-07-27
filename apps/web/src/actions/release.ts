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
  .inputSchema(createReleaseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createReleaseAction' });

    logger.debug({ parsedInput }, 'Creating release');

    const releaseService = await get(ReleaseService);
    const resource = await releaseService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASES));

    return { resource, success: true };
  });

export const deleteReleaseAction = workspaceAction
  .inputSchema(deleteReleaseSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteReleaseAction' });

    logger.debug({ parsedInput }, 'Deleting release');

    const releaseService = await get(ReleaseService);
    await releaseService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASES));

    return { success: true };
  });

export const createReleaseStrategyAction = workspaceAction
  .inputSchema(createReleaseStrategySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createReleaseStrategyAction' });

    logger.debug({ parsedInput }, 'Creating release strategy');

    const releaseStrategiesService = await get(ReleaseStrategiesService);
    const resource = await releaseStrategiesService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { resource, success: true };
  });

export const deleteReleaseStrategyAction = workspaceAction
  .inputSchema(deleteReleaseStrategySchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteReleaseStrategyAction' });

    logger.debug({ parsedInput }, 'Deleting release strategy');

    const releaseStrategiesService = await get(ReleaseStrategiesService);
    await releaseStrategiesService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES),
    );

    return { success: true };
  });

export const createReleaseStrategyStepAction = workspaceAction
  .inputSchema(createReleaseStrategyStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({
      name: 'createReleaseStrategyStepAction',
    });

    logger.debug({ parsedInput }, 'Creating release strategy step');

    const releaseStrategyStepService = await get(ReleaseStrategyStepService);
    const resource = await releaseStrategyStepService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS),
    );

    return { resource, success: true };
  });

export const deleteReleaseStrategyStepAction = workspaceAction
  .inputSchema(deleteReleaseStrategyStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({
      name: 'deleteReleaseStrategyStepAction',
    });

    logger.debug({ parsedInput }, 'Deleting release strategy step');

    const releaseStrategyStepService = await get(ReleaseStrategyStepService);
    await releaseStrategyStepService.delete(parsedInput.id);

    const { slug } = ctx.workspace;

    revalidatePath(
      dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS),
    );

    return { success: true };
  });

export const createReleaseStepAction = workspaceAction
  .inputSchema(createReleaseStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createReleaseStepAction' });

    logger.debug({ parsedInput }, 'Creating release step');

    const releaseStepService = await get(ReleaseStepService);
    const resource = await releaseStepService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS));

    return { resource, success: true };
  });

export const deleteReleaseStepAction = workspaceAction
  .inputSchema(deleteReleaseStepSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteReleaseStepAction' });

    logger.debug({ parsedInput }, 'Deleting release step');

    const releaseStepService = await get(ReleaseStepService);
    await releaseStepService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS));

    return { success: true };
  });
