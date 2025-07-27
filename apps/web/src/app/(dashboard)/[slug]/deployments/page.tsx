import { deleteDeploymentAction } from '@/actions/deployment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { DeploymentsService } from '@/services/deployments.service';
import { get } from '@/services/service-factory';

export default async function Deployments({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deploymentsService = await get(DeploymentsService);
  const deployments = await deploymentsService.findAll();

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
