import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateComponentVersion } from '@/components/dashboard/forms/create-component-version';
import { CreateReleaseComponent } from '@/components/dashboard/forms/create-release-component';
import { Navigation } from '@/config/navigation';
import { ComponentVersionService } from '@/services/component-version.service';
import { ComponentsService } from '@/services/components.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseComponent({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const componentVersions = await get(ComponentVersionService).findAll();

  if (!componentVersions?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Component Version"
        resource="Release Component"
        href={Navigation.DASHBOARD_COMPONENT_VERSIONS_NEW}
      />
    );
  }

  const releases = await get(ReleaseService).findAll();

  if (!releases?.length) {
    return (
      <RequiresDependencies
        slug={slug}
        dependency="Release"
        resource="Release Component"
        href={Navigation.DASHBOARD_RELEASES_NEW}
      />
    );
  }

  return (
    <CreateReleaseComponent
      componentVersions={componentVersions}
      releases={releases}
    />
  );
}
