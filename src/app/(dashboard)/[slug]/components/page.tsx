import { ComponentList } from '@/components/dashboard/lists/components';
import { ComponentsService } from '@/services/components.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function Components({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const components =
    await ServiceFactory.get(ComponentsService).getComponents();

  return <ComponentList slug={slug} components={components} />;
}
