import { deleteReleaseStepAction } from '@/actions/release';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseStepService } from '@/services/release-steps.service';
import { get } from '@/services/service-factory';

export default async function ReleaseSteps({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const releaseStepsService = await get(ReleaseStepService);
  const releaseSteps = await releaseStepsService.findAll();

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STEPS_NEW)}
      resourceName="Release Step"
      resources={releaseSteps}
      actions={{
        delete: deleteReleaseStepAction,
      }}
    />
  );
}
