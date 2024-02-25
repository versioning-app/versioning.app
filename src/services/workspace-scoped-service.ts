import { BaseService } from '@/services/base.service';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { TableConfig } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

export class WorkspaceScopedService extends BaseService {
  private readonly workspaceService: WorkspaceService;

  public constructor() {
    super();

    this.workspaceService = ServiceFactory.get(WorkspaceService);
  }

  public get currentWorkspaceId(): Promise<string> {
    return this.workspaceService.currentWorkspaceId();
  }

  public async currentWorkspace() {
    return this.workspaceService.currentWorkspace();
  }
}
