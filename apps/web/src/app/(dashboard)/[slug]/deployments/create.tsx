import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateDeploymentForm } from '@/components/dashboard/forms/create-deployments';
import { Navigation } from '@/config/navigation';
import { EnvironmentsService } from '@/services/environments.service';
import { ReleaseStepService } from '@/services/release-steps.service';
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
        resource="Deployment"
        href={Navigation.DASHBOARD_ENVIRONMENTS_NEW}
      />
    );
  }

  const releaseStepsService = await get(ReleaseStepService);
  const releaseSteps = await releaseStepsService.findAll();

  if (!releaseSteps?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release Step"
        resource="Deployment"
        href={Navigation.DASHBOARD_RELEASE_STEPS_NEW}
      />
    );
  }

  return (
    <CreateDeploymentForm
      environments={environments}
      releaseSteps={releaseSteps}
    />
  );
}
