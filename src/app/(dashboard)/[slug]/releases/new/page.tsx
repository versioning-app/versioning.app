import { CreateReleaseForm } from '@/components/dashboard/forms/create-release';
import { ReleaseStrategiesService } from '@/services/release-strategies.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseStrategyPage() {
  const releaseStrategies = await get(ReleaseStrategiesService).findAll();

  if (!releaseStrategies) {
    return <div>Please create a release strategy first</div>;
  }
  return (
    <div>
      <CreateReleaseForm releaseStrategies={releaseStrategies} />
    </div>
  );
}
