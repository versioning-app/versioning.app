'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ReleaseService } from '@/services/release.service';
import { ServiceFactory } from '@/services/service-factory';
import {
  createReleaseStrategySchema,
  deleteReleaseStrategySchema,
} from '@/validation/release';
import { revalidatePath } from 'next/cache';

export const createReleaseStrategyAction = workspaceAction(
  createReleaseStrategySchema,
  async (input, context) => {
    const logger = serverLogger({ source: 'createReleaseStrategyAction' });

    logger.debug({ input }, 'Creating release strategy');

    const releaseService = ServiceFactory.get(ReleaseService);
    const releaseStrategy = await releaseService.createReleaseStrategy(input);

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
    const logger = serverLogger({ source: 'deleteReleaseStrategyAction' });

    logger.debug({ input }, 'Deleting release strategy');

    const releaseService = ServiceFactory.get(ReleaseService);

    await releaseService.deleteReleaseStrategy(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));
  },
);
