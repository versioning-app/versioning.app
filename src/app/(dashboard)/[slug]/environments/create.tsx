import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateEnvironmentForm } from '@/components/dashboard/forms/create-environment';
import { Navigation } from '@/config/navigation';
import { EnvironmentTypesService } from '@/services/environment-types.service';
import { get } from '@/services/service-factory';

export default async function NewEnvironment({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const environmentTypesService = get(EnvironmentTypesService);
  const environmentTypes = await environmentTypesService.findAll();

  if (!environmentTypes?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Environment Types"
        resource="Environment"
        href={Navigation.DASHBOARD_ENVIRONMENT_TYPES_NEW}
      />
    );
  }

  return <CreateEnvironmentForm environmentTypes={environmentTypes} />;
}
