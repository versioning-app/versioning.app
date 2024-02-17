import { ComponentList } from '@/components/dashboard/component';
import { ComponentsService } from '@/services/components.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function Components() {
  const components =
    await ServiceFactory.get(ComponentsService).getComponents();

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <ComponentList components={components} />
        </div>
      </div>
    </div>
  );
}
