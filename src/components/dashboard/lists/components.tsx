'use client';
import { deleteComponentAction } from '@/actions/components';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { Component } from '@/database/schema';

export const ComponentList = ({
  slug,
  components,
}: {
  slug: string;
  components: Component[] | undefined;
}) => {
  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS)}
      resourceName="Component"
      resources={components}
      actions={{
        delete: deleteComponentAction,
      }}
    />
  );
};
