import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateReleaseStrategyStepForm } from '@/components/dashboard/forms/create-release-strategy-step';
import { Navigation } from '@/config/navigation';
import { ApprovalGroupService } from '@/services/approval-group.service';
import { EnvironmentsService } from '@/services/environments.service';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseStrategyStep({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environments = await get(EnvironmentsService).findAll();

  if (!environments?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Environment"
        resource="Release Strategy Step"
        href={Navigation.DASHBOARD_ENVIRONMENTS_NEW}
      />
    );
  }

  const approvalGroups = await get(ApprovalGroupService).findAll();

  if (!approvalGroups?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Approval Group"
        resource="Release Strategy Step"
        href={Navigation.DASHBOARD_APPROVAL_GROUPS_NEW}
      />
    );
  }

  const releaseStrategies = await get(ReleaseStrategiesService).findAll();

  if (!releaseStrategies?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release Strategies"
        resource="Release Strategy Step"
        href={Navigation.DASHBOARD_RELEASE_STRATEGIES_NEW}
      />
    );
  }

  const releaseStrategySteps = await get(ReleaseStrategyStepService).findAll();

  return (
    <CreateReleaseStrategyStepForm
      releaseStrategies={releaseStrategies}
      approvalGroups={approvalGroups}
      environments={environments}
      releaseStrategySteps={releaseStrategySteps ?? []}
    />
  );
}
