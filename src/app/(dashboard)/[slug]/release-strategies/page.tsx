import { deleteReleaseStrategyAction } from '@/actions/release';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function ReleaseStrategiesPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseService = get(ReleaseService);
  const releaseStrategies = await releaseService.getReleaseStrategies();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES)}
      resourceName="Release Strategy"
      resources={releaseStrategies}
      actions={{
        delete: deleteReleaseStrategyAction,
      }}
    />
  );
}
