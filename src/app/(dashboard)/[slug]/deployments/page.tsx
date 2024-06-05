import { deleteDeploymentAction } from '@/actions/deployment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseStepService } from '@/services/release-steps.service';
import { get } from '@/services/service-factory';

export default async function ReleaseStrategyStepsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const deployments = await get(ReleaseStepService).findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_DEPLOYMENTS)}
      resourceName="Deployment"
      resources={deployments}
      actions={{
        delete: deleteDeploymentAction,
      }}
    />
  );
}
