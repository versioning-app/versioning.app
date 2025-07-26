import { deleteApiKeyAction } from '@/actions/api-keys';
import { List } from '@/components/dashboard/lists/list-item';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ApiKeysService } from '@/services/api-keys.service';
import { get } from '@/services/service-factory';

export default async function ApiKeys({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const apiKeysService = await get(ApiKeysService);
  const apiKeys = (await apiKeysService.findAll()).map((apiKey) => ({
    ...apiKey,
    // TODO: Re-enable this in the future when we have a way to have post-create actions
    // key: apiKey.key.slice(0, 4) + '•'.repeat(16),
  }));

  return (
    <List
      createLink={dashboardRoute(slug, Navigation.DASHBOARD_API_KEYS_NEW)}
      resourceName="Api Key"
      resources={apiKeys}
      actions={{
        delete: deleteApiKeyAction,
      }}
    />
  );
}
