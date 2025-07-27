import { RequiresDependencies } from '@/components/dashboard/errors';
import { CreateComponentVersion } from '@/components/dashboard/forms/create-component-version';
import { CreateReleaseComponent } from '@/components/dashboard/forms/create-release-component';
import { Navigation } from '@/config/navigation';
import { ComponentVersionService } from '@/services/component-version.service';
import { ComponentsService } from '@/services/components.service';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function NewReleaseComponent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const componentVersionsService = await get(ComponentVersionService);
  const componentVersions = await componentVersionsService.findAll();

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

  const releasesService = await get(ReleaseService);
  const releases = await releasesService.findAll();

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
