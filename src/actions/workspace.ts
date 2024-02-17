'use server';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { changeSlugSchema } from '@/validation/workspace';

export const changeSlugAction = workspaceAction(
  changeSlugSchema,
  async ({ slug }) => {
    const logger = serverLogger({ source: 'changeSlugAction' });

    logger.debug({ changeSlugAction }, 'Attempting to change slug');

    const workspaceService = ServiceFactory.get(WorkspaceService);

    const updated = await workspaceService.changeSlug({ slug });
    logger.debug({ updated }, 'Slug changed successfully');

    return updated;
  },
);
