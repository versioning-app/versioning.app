'use client';
import { deleteEnvironmentTypeAction } from '@/actions/environment';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { EnvironmentType } from '@/database/schema';

export const EnvironmentTypeList = ({
  slug,
  environmentTypes,
}: {
  slug: string;
  environmentTypes: EnvironmentType[] | undefined;
}) => {
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
};
