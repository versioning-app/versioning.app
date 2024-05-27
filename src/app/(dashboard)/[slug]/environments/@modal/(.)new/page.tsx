import { CreateEnvironmentForm } from '@/components/dashboard/forms/create-environment';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { get } from '@/services/service-factory';

export default async function NewEnvironmentModal() {
  const environmentTypesService = get(EnvironmentTypesService);
  const environmentTypes = await environmentTypesService.findAll();

  if (!environmentTypes) {
    return <div>Please create an environment type first</div>;
  }

  return (
    <PageDialog>
      <DialogContent>
        <CreateEnvironmentForm environmentTypes={environmentTypes} />
      </DialogContent>
    </PageDialog>
  );
}
