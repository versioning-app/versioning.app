import { RequiresDependencies } from '@/components/dashboard/errors';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseComponentService } from '@/services/release-component.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function ReleaseComponents({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const releases = await (await get(ReleaseService)).findAll();

  if (!releases?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release"
        resource="Release Component"
        href={Navigation.DASHBOARD_RELEASES_NEW}
      />
    );
  }

  const releaseComponentsService = await get(ReleaseComponentService);
  const releaseComponents = await releaseComponentsService.findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_COMPONENTS)}
      resourceName="Release Component"
      resources={releaseComponents}
    />
  );
}
