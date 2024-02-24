import { WorkspaceScopedService } from '@/services/workspace-scoped-service';
import { db } from '@/database/db';
import { Component, components, environments } from '@/database/schema';
import { eq } from 'drizzle-orm';
import 'server-only';

export class EnvironmentsService extends WorkspaceScopedService {
  public constructor() {
    super();
  }

  public async getEnvironments(): Promise<Component[] | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    const allEnvironments = await db
      .select()
      .from(environments)
      .where(eq(environments.workspaceId, workspaceId));

    this.logger.debug({ allEnvironments }, 'Environments found');

    return allEnvironments;
  }
}
