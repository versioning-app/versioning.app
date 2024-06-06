import { deleteReleaseStrategyAction } from '@/actions/release';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function Overview({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseService = get(ReleaseService);
  const overviews = await releaseService.getOverview();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASES)}
      resourceName="Release"
      resources={overviews}
    />
  );
}
