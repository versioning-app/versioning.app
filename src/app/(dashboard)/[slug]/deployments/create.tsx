import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateDeploymentForm } from '@/components/dashboard/forms/create-deployments';
import { Navigation } from '@/config/navigation';
import { EnvironmentsService } from '@/services/environments.service';
import { ReleaseStepService } from '@/services/release-steps.service';
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
        resource="Deployment"
        href={Navigation.DASHBOARD_ENVIRONMENTS_NEW}
      />
    );
  }

  const releaseSteps = await get(ReleaseStepService).findAll();

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
