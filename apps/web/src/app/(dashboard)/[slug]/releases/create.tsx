import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateReleaseForm } from '@/components/dashboard/forms/create-release';
import { Navigation } from '@/config/navigation';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { get } from '@/services/service-factory';

export default async function NewRelease({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseStrategies = await get(ReleaseStrategiesService).findAll();

  if (!releaseStrategies?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release Strategies"
        resource="Release"
        href={Navigation.DASHBOARD_RELEASE_STRATEGIES_NEW}
      />
    );
  }

  return <CreateReleaseForm releaseStrategies={releaseStrategies} />;
}
