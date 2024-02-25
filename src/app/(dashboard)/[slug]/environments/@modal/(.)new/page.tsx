import { CreateEnvironmentForm } from '@/components/dashboard/forms/create-environment';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';
import { EnvironmentsService } from '@/services/environments.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function NewEnvironmentModal() {
  const environmentsService = ServiceFactory.get(EnvironmentsService);
  const environmentTypes = await environmentsService.getEnvironmentTypes();

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
