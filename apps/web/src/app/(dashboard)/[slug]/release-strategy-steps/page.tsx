import { deleteReleaseStrategyStepAction } from '@/actions/release';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { ReleaseStrategyStepService } from '@/services/release-strategy-steps.service';
import { get } from '@/services/service-factory';

export default async function ReleaseStrategySteps({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const releaseStrategyStepsService = await get(ReleaseStrategyStepService);
  const releaseStrategySteps = await releaseStrategyStepsService.findAll();

  return (
    <List
      createLink={dashboardRoute(
        slug,
        Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS_NEW,
      )}
      resourceName="Release Strategy Step"
      resources={releaseStrategySteps}
      actions={{
        delete: deleteReleaseStrategyStepAction,
      }}
    />
  );
}
