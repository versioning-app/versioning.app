import { deleteComponentVersionAction } from '@/actions/components';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ComponentVersionService } from '@/services/component-version.service';
import { get } from '@/services/service-factory';

export default async function ComponentVersion({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const componentVersionsService = await get(ComponentVersionService);
  const componentVersions =
    await componentVersionsService.findAllByComponentId(id);

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
