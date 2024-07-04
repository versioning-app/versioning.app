'use server';
import { serverLogger } from '@/lib/logger/server';
import { workspaceAction } from '@/lib/safe-action';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { changeSlugSchema } from '@/validation/workspace';

export const changeSlugAction = workspaceAction
  .schema(changeSlugSchema)
  .action(async ({ parsedInput: { slug } }) => {
    const logger = serverLogger({ name: 'changeSlugAction' });

    logger.debug({ changeSlugAction }, 'Attempting to change slug');

    const workspaceService = get(WorkspaceService);

    const updated = await workspaceService.changeSlug({ slug });
    logger.debug({ updated }, 'Slug changed successfully');

    return updated;
  });
