'use client';
import { deleteReleaseStrategyAction } from '@/actions/release';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseStrategy } from '@/database/schema';

export const ReleaseStrategiesList = ({
  slug,
  releaseStrategies,
}: {
  slug: string;
  releaseStrategies: ReleaseStrategy[] | undefined;
}) => {
  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_RELEASE_STRATEGIES)}
      resourceName="Release Strategy"
      resources={releaseStrategies}
      actions={{
        delete: deleteReleaseStrategyAction,
      }}
    />
  );
};
