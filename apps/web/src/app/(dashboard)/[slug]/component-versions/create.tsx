import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateComponentVersion } from '@/components/dashboard/forms/create-component-version';
import { Navigation } from '@/config/navigation';
import { ComponentsService } from '@/services/components.service';
import { get } from '@/services/service-factory';

export default async function NewComponentVersion({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const componentsService = await get(ComponentsService);
  const components = await componentsService.findAll();

  if (!components?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Component"
        resource="Component Version"
        href={Navigation.DASHBOARD_RELEASE_STRATEGIES_NEW}
      />
    );
  }

  return <CreateComponentVersion components={components} />;
}
