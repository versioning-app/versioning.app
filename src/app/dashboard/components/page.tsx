import { ComponentsService } from '@/services/components.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function Components() {
  const components = await ServiceFactory.get(
    ComponentsService
  ).getComponents();

  return (
    <div>
      <h1>Components</h1>
      <pre>{JSON.stringify(components, null, 2)}</pre>
    </div>
  );
}
