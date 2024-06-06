import { Overview } from '@/components/dashboard/overview';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function OverviewPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseService = get(ReleaseService);
  const overviews = await releaseService.getOverview();

  return (
    // <List
    //   createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASES)}
    //   resourceName="Release"
    //   resources={overviews}
    // />
    <div className="mb-24 h-full w-full">
      <Overview data={overviews} />
    </div>
  );
}
