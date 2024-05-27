import { CreateEnvironmentForm } from '@/components/dashboard/forms/create-environment';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { get } from '@/services/service-factory';

export default async function NewEnvironmentPage() {
  const environmentTypesService = get(EnvironmentTypesService);
  const environmentTypes = await environmentTypesService.findAll();

  if (!environmentTypes) {
    return <div>Please create an environment type first</div>;
  }

  return (
    <div>
      <CreateEnvironmentForm environmentTypes={environmentTypes} />
    </div>
  );
}
