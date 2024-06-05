import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseComponentService } from '@/services/release-component.service';
import { get } from '@/services/service-factory';

export default async function ComponentVersion({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const releaseComponents = await get(ReleaseComponentService).findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_COMPONENTS)}
      resourceName="Release Component"
      resources={releaseComponents}
    />
  );
}
