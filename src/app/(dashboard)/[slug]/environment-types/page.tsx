import { deleteEnvironmentTypeAction } from '@/actions/environment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { get } from '@/services/service-factory';

export default async function EnvironmentTypesPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environmentTypesService = get(EnvironmentTypesService);
  const environmentTypes = await environmentTypesService.findAll();

  return (
    <List
      createLink={dashboardRoute(
        slug,
        Navigation.DASHBOARD_ENVIRONMENT_TYPES_NEW,
      )}
      resourceName="Environment Type"
      resources={environmentTypes}
      actions={{
        delete: deleteEnvironmentTypeAction,
      }}
    />
  );
}
