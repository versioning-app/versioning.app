import { CreateComponentForm } from '@/components/dashboard/forms/create-component-form';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';

export default function NewComponentModal() {
  return (
    <PageDialog>
      <DialogContent>
        <CreateComponentForm />
      </DialogContent>
    </PageDialog>
  );
}
