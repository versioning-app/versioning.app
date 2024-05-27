import { NewRelease, Release, releases } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { eq } from 'drizzle-orm';
import 'server-only';

export class ReleaseService extends WorkspaceScopedRepository<typeof releases> {
  public constructor() {
    super(releases);
  }

  public async create(
    newRelease: Pick<
      NewRelease,
      | 'description'
      | 'status'
      | 'version'
      | 'strategyId'
      | 'date'
      | 'workspaceId'
    >,
  ): Promise<Release> {
    return super.create(newRelease, eq(releases.version, newRelease.version));
  }
}
