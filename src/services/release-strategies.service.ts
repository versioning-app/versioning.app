import {
  NewReleaseStrategy,
  ReleaseStrategy,
  releaseStrategies,
} from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { eq } from 'drizzle-orm';
import 'server-only';

export class ReleaseStrategiesService extends WorkspaceScopedRepository<
  typeof releaseStrategies
> {
  public constructor() {
    super(releaseStrategies);
  }

  public async create(
    newReleaseStrategy: Pick<NewReleaseStrategy, 'name' | 'description'>,
  ): Promise<ReleaseStrategy> {
    return super.create(
      newReleaseStrategy,
      eq(releaseStrategies.name, newReleaseStrategy.name),
    );
  }
}
