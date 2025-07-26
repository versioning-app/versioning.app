import { api_keys } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { type AppHeaders } from '@/types/headers';
import 'server-only';

export class ApiKeysService extends WorkspaceScopedRepository<typeof api_keys> {
  public constructor(headers: AppHeaders) {
    super(headers, api_keys);
  }
}
