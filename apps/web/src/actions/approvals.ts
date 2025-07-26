'use server';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ApprovalGroupService } from '@/services/approval-group.service';
import { get } from '@/services/service-factory';
import {
  createApprovalGroupSchema,
  deleteApprovalGroupSchema,
} from '@/validation/approvals';
import { revalidatePath } from 'next/cache';

export const createApprovalGroupAction = workspaceAction
  .schema(createApprovalGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'createApprovalGroup' });

    logger.debug({ parsedInput }, 'Creating approval group');

    const resource = await get(ApprovalGroupService).create(parsedInput);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_APPROVAL_GROUPS));

    return { resource, success: true };
  });

export const deleteApprovalGroupAction = workspaceAction
  .schema(deleteApprovalGroupSchema)
  .action(async ({ parsedInput, ctx }) => {
    const logger = await serverLogger({ name: 'deleteApprovalGroupSchema' });

    logger.debug({ parsedInput }, 'Deleting approval group');

    await get(ApprovalGroupService).delete(parsedInput.id);

    const { slug } = ctx.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_APPROVAL_GROUPS));

    return { success: true };
  });
