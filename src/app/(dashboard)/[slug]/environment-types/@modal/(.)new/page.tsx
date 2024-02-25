import { CreateEnvironmentTypeForm } from '@/components/dashboard/forms/create-environment-type';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';

export default async function NewEnvironmentModal() {
  return (
    <PageDialog>
      <DialogContent>
        <CreateEnvironmentTypeForm />
      </DialogContent>
    </PageDialog>
  );
}
