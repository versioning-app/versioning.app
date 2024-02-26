import { WorkspaceScopedService } from '@/services/workspace-scoped-service';

import 'server-only';

export class StatsService extends WorkspaceScopedService {
  public constructor() {
    super();
  }
}
