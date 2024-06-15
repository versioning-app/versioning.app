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

export const createApprovalGroupAction = workspaceAction(
  createApprovalGroupSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'createApprovalGroup' });

    logger.debug({ input }, 'Creating approval group');

    const resource = await get(ApprovalGroupService).create(input);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_APPROVAL_GROUPS));

    return { resource, success: true };
  },
);

export const deleteApprovalGroupAction = workspaceAction(
  deleteApprovalGroupSchema,
  async (input, context) => {
    const logger = serverLogger({ name: 'deleteApprovalGroupSchema' });

    logger.debug({ input }, 'Deleting approval group');

    await get(ApprovalGroupService).delete(input.id);

    const { slug } = context.workspace;
    revalidatePath(dashboardRoute(slug, Navigation.DASHBOARD_APPROVAL_GROUPS));

    return { success: true };
  },
);
