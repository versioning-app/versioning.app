import {
  NewReleaseStrategy,
  ReleaseStrategy,
  release_strategies,
} from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { eq } from 'drizzle-orm';
import 'server-only';

export class ReleaseStrategiesService extends WorkspaceScopedRepository<
  typeof release_strategies
> {
  public constructor() {
    super(release_strategies);
  }

  public async create(
    newReleaseStrategy: Pick<NewReleaseStrategy, 'name' | 'description'>,
  ): Promise<ReleaseStrategy> {
    return super.create(
      newReleaseStrategy,
      eq(release_strategies.name, newReleaseStrategy.name),
    );
  }
}
