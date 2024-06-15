import { deleteComponentAction } from '@/actions/components';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ComponentsService } from '@/services/components.service';
import { get } from '@/services/service-factory';

export default async function Components({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const components = await get(ComponentsService).findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS_NEW)}
      resourceName="Component"
      resources={components}
      actions={{
        delete: deleteComponentAction,
      }}
    />
  );
}
