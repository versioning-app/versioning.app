import { deleteEnvironmentAction } from '@/actions/environment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { EnvironmentsService } from '@/services/environments.service';
import { get } from '@/services/service-factory';

export default async function EnvironmentsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environments = await get(EnvironmentsService).getEnvironments();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS)}
      resourceName="Environment"
      resources={environments}
      actions={{
        delete: deleteEnvironmentAction,
      }}
    />
  );
}
