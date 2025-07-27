import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateReleaseStrategyStepForm } from '@/components/dashboard/forms/create-release-strategy-step';
import { Navigation } from '@/config/navigation';
import { ApprovalGroupService } from '@/services/approval-group.service';
import { EnvironmentsService } from '@/services/environments.service';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseStrategyStep({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const environmentsService = await get(EnvironmentsService);
  const environments = await environmentsService.findAll();

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

  const approvalGroupsService = await get(ApprovalGroupService);
  const approvalGroups = await approvalGroupsService.findAll();

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

  const releaseStrategiesService = await get(ReleaseStrategiesService);
  const releaseStrategies = await releaseStrategiesService.findAll();

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

  const releaseStrategyStepsService = await get(ReleaseStrategyStepService);
  const releaseStrategySteps = await releaseStrategyStepsService.findAll();

  return (
    <CreateReleaseStrategyStepForm
      releaseStrategies={releaseStrategies}
      approvalGroups={approvalGroups}
      environments={environments}
      releaseStrategySteps={releaseStrategySteps ?? []}
    />
  );
}
