'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { DeploymentsService } from '@/services/deployments.service';
import { get } from '@/services/service-factory';
import {
  createDeploymentsSchema,
  deleteDeploymentsSchema,
} from '@/validation/deployment';
import { revalidatePath } from 'next/cache';

export const createDeploymentAction = workspaceAction(
  createDeploymentsSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createDeploymentAction' });

    logger.debug({ input }, 'Creating deployment');

    const resource = await get(DeploymentsService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { resource, success: true };
  },
);

export const deleteDeploymentAction = workspaceAction(
  deleteDeploymentsSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteEnvironmentAction' });

    logger.debug({ input }, 'Deleting deployment');

    await get(DeploymentsService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_DEPLOYMENTS));

    return { success: true };
  },
);
