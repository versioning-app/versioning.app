import { deleteEnvironmentAction } from '@/actions/environment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { EnvironmentsService } from '@/services/environments.service';
import { get } from '@/services/service-factory';

export default async function Environments({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const environmentsService = await get(EnvironmentsService);
  const environments = await environmentsService.findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS_NEW)}
      resourceName="Environment"
      resources={environments}
      actions={{
        delete: deleteEnvironmentAction,
      }}
    />
  );
}
