import { deleteComponentVersionAction } from '@/actions/components';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ComponentVersionService } from '@/services/component-version.service';
import { get } from '@/services/service-factory';

export default async function ComponentVersions({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const componentVersionsService = await get(ComponentVersionService);
  const componentVersions = await componentVersionsService.findAll();

  return (
    <List
      createLink={dashboardRoute(
        slug,
        Navigation.DASHBOARD_COMPONENT_VERSIONS_NEW,
      )}
      resourceName="Component Version"
      resources={componentVersions}
      actions={{
        delete: deleteComponentVersionAction,
      }}
    />
  );
}
