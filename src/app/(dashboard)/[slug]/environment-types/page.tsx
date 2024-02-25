import { EnvironmentTypeList } from '@/components/dashboard/lists/environment-type';
import { EnvironmentsService } from '@/services/environments.service';
import { ServiceFactory } from '@/services/service-factory';

export default async function EnvironmentTypesPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environmentService = ServiceFactory.get(EnvironmentsService);
  const environmentTypes = await environmentService.getEnvironmentTypes();

  return (
    <EnvironmentTypeList slug={slug} environmentTypes={environmentTypes} />
  );
}
