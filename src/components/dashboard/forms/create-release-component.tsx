'use client';
import { createReleaseComponentAction } from '@/actions/components';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { ComponentVersion, Release } from '@/database/schema';
import { createReleaseComponentSchema } from '@/validation/component';

export function CreateReleaseComponent({
  componentVersions,
  releases,
}: {
  componentVersions: ComponentVersion[];
  releases: Release[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_COMPONENTS}
      resource="Release Component"
      schema={createReleaseComponentSchema}
      action={createReleaseComponentAction}
      fieldConfig={{
        componentVersionId: {
          fieldType: 'select',
          inputProps: {
            values: componentVersions.map((componentVersion) => ({
              value: componentVersion.id,
              label: componentVersion.version,
            })),
          },
        },
        releaseId: {
          fieldType: 'select',
          inputProps: {
            values: releases.map((release) => ({
              value: release.id,
              label: release.version,
            })),
          },
        },
      }}
    />
  );
}
