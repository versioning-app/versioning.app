import { deleteComponentVersionAction } from '@/actions/components';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ComponentVersionService } from '@/services/component-version.service';
import { get } from '@/services/service-factory';

export default async function ComponentVersion({
  params: { slug, id },
}: {
  params: { slug: string; id: string };
}) {
  const componentVersions = await get(
    ComponentVersionService,
  ).findAllByComponentId(id);

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_COMPONENT_VERSIONS)}
      resourceName="Component Version"
      resources={componentVersions}
      actions={{
        delete: deleteComponentVersionAction,
      }}
    />
  );
}
