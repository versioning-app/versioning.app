import { api_keys } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import 'server-only';

export class ApiKeysService extends WorkspaceScopedRepository<typeof api_keys> {
  public constructor() {
    super(api_keys);
  }
}
