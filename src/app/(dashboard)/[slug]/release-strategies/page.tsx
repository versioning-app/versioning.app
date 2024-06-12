import { deleteReleaseStrategyAction } from '@/actions/release';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { get } from '@/services/service-factory';

export default async function ReleaseStrategiesPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseStrategiesService = get(ReleaseStrategiesService);
  const releaseStrategies = await releaseStrategiesService.findAll();

  return (
    <List
      createLink={dashboardRoute(
        slug,
        Navigation.DASHBOARD_RELEASE_STRATEGIES_NEW,
      )}
      resourceName="Release Strategy"
      resources={releaseStrategies}
      actions={{
        delete: deleteReleaseStrategyAction,
      }}
    />
  );
}
