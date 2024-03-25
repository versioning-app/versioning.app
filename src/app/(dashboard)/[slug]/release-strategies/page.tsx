import { ReleaseStrategiesList } from '@/components/dashboard/lists/release-strategies';
import { ReleaseService } from '@/services/release.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function ReleaseStrategiesPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseService = ServiceFactory.get(ReleaseService);
  const releaseStrategies = await releaseService.getReleaseStrategies();

  return (
    <ReleaseStrategiesList slug={slug} releaseStrategies={releaseStrategies} />
  );
}
