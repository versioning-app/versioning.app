import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateReleaseStepForm } from '@/components/dashboard/forms/create-release-step';
import { Navigation } from '@/config/navigation';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseStrategyStep({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const releasesService = await get(ReleaseService);
  const releases = await releasesService.findAll();

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

  const releaseStrategyStepsService = await get(ReleaseStrategyStepService);
  const releaseStrategySteps = await releaseStrategyStepsService.findAll();

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
