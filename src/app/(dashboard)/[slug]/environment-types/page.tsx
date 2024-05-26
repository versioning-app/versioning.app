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

  const deps = await environmentTypesService.hasDependents('dev_env_type');
  const aa = await environmentTypesService.hasDependents(
    'dmzozvqh6okncjg5qqmuofgl',
  );

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
