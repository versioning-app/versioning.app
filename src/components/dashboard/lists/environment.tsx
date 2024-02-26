'use client';
import { deleteEnvironmentAction } from '@/actions/environment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { Environment } from '@/database/schema';

export const EnvironmentList = ({
  slug,
  environments,
}: {
  slug: string;
  environments: Environment[] | undefined;
}) => {
  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_ENVIRONMENTS)}
      resourceName="Environment"
      resources={environments}
      actions={{
        delete: deleteEnvironmentAction,
      }}
    />
  );
};
