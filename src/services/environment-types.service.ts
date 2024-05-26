import { environmentTypes } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import 'server-only';

export class EnvironmentTypesService extends WorkspaceScopedRepository<
  typeof environmentTypes
> {
  public constructor() {
    super(environmentTypes);
  }
}
