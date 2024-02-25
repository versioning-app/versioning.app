import { prettyPrint } from '@/lib/utils';
import { EnvironmentsService } from '@/services/environments.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function EnvironmentsPage() {
  const environments =
    await ServiceFactory.get(EnvironmentsService).getEnvironments();

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <pre>{prettyPrint(environments)}</pre>
        </div>
      </div>
    </div>
  );
}
