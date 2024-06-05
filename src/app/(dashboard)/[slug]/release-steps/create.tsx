import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateReleaseStepForm } from '@/components/dashboard/forms/create-release-step';
import { Navigation } from '@/config/navigation';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseStrategyStep({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releases = await get(ReleaseService).findAll();

  if (!releases?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release"
        resource="Release Step"
        href={Navigation.DASHBOARD_RELEASES_NEW}
      />
    );
  }

  const releaseStrategySteps = await get(ReleaseStrategyStepService).findAll();

  if (!releaseStrategySteps?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release Strategy Step"
        resource="Release Step"
        href={Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS_NEW}
      />
    );
  }

  return (
    <CreateReleaseStepForm
      releases={releases}
      releaseStrategySteps={releaseStrategySteps}
    />
  );
}
