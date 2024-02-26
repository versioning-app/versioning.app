import { EnvironmentList } from '@/components/dashboard/lists/environment';
import { EnvironmentsService } from '@/services/environments.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function EnvironmentsPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environments =
    await ServiceFactory.get(EnvironmentsService).getEnvironments();

  return <EnvironmentList slug={slug} environments={environments} />;
}
