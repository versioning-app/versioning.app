import { deleteDeploymentAction } from '@/actions/deployment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { DeploymentsService } from '@/services/deployments.service';
import { get } from '@/services/service-factory';

export default async function ReleaseStrategyStepsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const deployments = await get(DeploymentsService).findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_DEPLOYMENTS_NEW)}
      resourceName="Deployment"
      resources={deployments}
      actions={{
        delete: deleteDeploymentAction,
      }}
    />
  );
}
