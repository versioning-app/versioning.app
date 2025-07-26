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

export const createDeploymentAction = workspaceAction
  .inputSchema(createDeploymentsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createDeploymentAction' });

    logger.debug({ parsedInput }, 'Creating deployment');

    const deploymentsService = await get(DeploymentsService);
    const resource = await deploymentsService.create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS));

    return { resource, success: true };
  });

export const deleteDeploymentAction = workspaceAction
  .inputSchema(deleteDeploymentsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteEnvironmentAction' });

    logger.debug({ parsedInput }, 'Deleting deployment');

    const deploymentsService = await get(DeploymentsService);
    await deploymentsService.delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_DEPLOYMENTS));

    return { success: true };
  });
