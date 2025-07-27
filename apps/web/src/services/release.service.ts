import { NewRelease, Release, releases } from '@/database/schema';
import { WorkspaceScopedRepository } from '@/services/repository/workspace-scoped-repository.service';
import { type AppHeaders } from '@/types/headers';
import { eq, sql } from 'drizzle-orm';
import 'server-only';

export class ReleaseService extends WorkspaceScopedRepository<typeof releases> {
  public constructor(headers: AppHeaders) {
    super(headers, releases);
  }

  public async create(
    newRelease: Pick<
      NewRelease,
      'description' | 'status' | 'version' | 'strategyId' | 'date'
    >,
  ): Promise<Release> {
    return super.create(newRelease, eq(releases.version, newRelease.version));
  }

  public async getOverview(releaseId: string): Promise<any> {
    const execution = await this.db.execute(
      sql`
        WITH RECURSIVE release_strategy_steps_hierarchy AS (
          SELECT id, name, release_strategy_id, action, parent_id, 1 AS order
          FROM release_strategy_steps
          WHERE parent_id IS NULL
          UNION ALL
          SELECT RSS.id, RSS.name, RSS.release_strategy_id, RSS.action, RSS.parent_id, RSSH.order + 1
          FROM release_strategy_steps RSS
          JOIN release_strategy_steps_hierarchy RSSH ON RSS.parent_id = RSSH.id
        )
        SELECT R.id as release_id, RSSH.id as release_strategy_step_id, STEPS.id as release_step_id, RSSH.action, A.approved, A.type as approval_type, M.clerk_id as approval_member, RSSH.name, D.environment_id, E.name as environment_name, D.status as deployment_status, RSSH.release_strategy_id, RSSH.parent_id, RSSH.order, STEPS.status as release_step_status, STEPS.finalized_at as release_step_finalized_at
        FROM release_strategy_steps_hierarchy RSSH
        INNER JOIN release_strategies RS ON (RS.id = RSSH.release_strategy_id)
        INNER JOIN releases R ON (R.release_strategy_id = RS.id)
        LEFT OUTER JOIN release_steps STEPS on (STEPS.release_strategy_step_id = RSSH.id AND R.id = STEPS.release_id)
        LEFT OUTER JOIN deployments D ON (STEPS.id = D.release_step_id)
        LEFT OUTER JOIN environments E ON (D.environment_id = E.id)
        LEFT OUTER JOIN approvals A ON (A.release_step_id = STEPS.id)
        LEFT OUTER JOIN members M ON (M.id = A.member_id)
        WHERE R.id = ${releaseId}
        ORDER BY R.id, RSSH.release_strategy_id, RSSH.order;`,
    );

    this.logger.debug(
      { rows: execution?.rows },
      'getOverview execution result',
    );

    return execution?.rows;
  }
}
