import { CreateReleaseStrategiesForm } from '@/components/dashboard/forms/create-release-strategies';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';

export default async function NewReleaseStrategyModal() {
  return (
    <PageDialog>
      <DialogContent>
        <CreateReleaseStrategiesForm />
      </DialogContent>
    </PageDialog>
  );
}
