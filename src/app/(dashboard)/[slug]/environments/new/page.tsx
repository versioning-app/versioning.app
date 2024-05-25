import { CreateEnvironmentForm } from '@/components/dashboard/forms/create-environment';
import { EnvironmentsService } from '@/services/environments.service';
import { get } from '@/services/service-factory';

export default async function NewEnvironmentPage() {
  const environmentsService = get(EnvironmentsService);
  const environmentTypes = await environmentsService.getEnvironmentTypes();

  if (!environmentTypes) {
    return <div>Please create an environment type first</div>;
  }

  return (
    <div>
      <CreateEnvironmentForm environmentTypes={environmentTypes} />
    </div>
  );
}
