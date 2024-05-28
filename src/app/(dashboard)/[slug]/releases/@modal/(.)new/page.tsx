import { CreateReleaseForm } from '@/components/dashboard/forms/create-release';
import { PageDialog } from '@/components/dashboard/page-dialog';
import { DialogContent } from '@/components/ui/dialog';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseStrategyModal() {
  const releaseStrategies = await get(ReleaseStrategiesService).findAll();

  if (!releaseStrategies) {
    return <div>Please create a release strategy first</div>;
  }

  return (
    <PageDialog>
      <DialogContent>
        <CreateReleaseForm releaseStrategies={releaseStrategies} />
      </DialogContent>
    </PageDialog>
  );
}
