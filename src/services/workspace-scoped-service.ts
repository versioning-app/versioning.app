import { BaseService } from '@/services/base.service';
import { get } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';

export class WorkspaceScopedService extends BaseService {
  private readonly workspaceService: WorkspaceService;

  public constructor() {
    super();

    this.workspaceService = get(WorkspaceService);
  }

  public get currentWorkspaceId(): Promise<string> {
    return this.workspaceService.currentWorkspaceId();
  }

  public async currentWorkspace() {
    return this.workspaceService.currentWorkspace();
  }
}
