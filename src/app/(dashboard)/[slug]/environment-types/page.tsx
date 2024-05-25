import { deleteEnvironmentTypeAction } from '@/actions/environment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { EnvironmentsService } from '@/services/environments.service';
import { get } from '@/services/service-factory';

export default async function EnvironmentTypesPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environmentService = get(EnvironmentsService);
  const environmentTypes = await environmentService.getEnvironmentTypes();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENT_TYPES)}
      resourceName="Environment Type"
      resources={environmentTypes}
      actions={{
        delete: deleteEnvironmentTypeAction,
      }}
    />
  );
}
