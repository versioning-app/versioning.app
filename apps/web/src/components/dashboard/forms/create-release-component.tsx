'use client';
import { createReleaseComponentAction } from '@/actions/components';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import { ComponentVersion, Release } from '@/database/schema';
import { enhanceFields } from '@/lib/validation';
import { createReleaseComponentSchema } from '@/validation/component';

export function CreateReleaseComponent({
  componentVersions,
  releases,
}: {
  componentVersions: ComponentVersion[];
  releases: Release[];
}) {
  const enhancedSchema = enhanceFields(createReleaseComponentSchema, {
    componentVersionId: {
      define: 'Component version to include in release',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: componentVersions.map((componentVersion) => ({
            value: componentVersion.id,
            label: componentVersion.version,
          })),
        },
      }),
    },
    releaseId: {
      define: 'Release to add component to',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: releases.map((release) => ({
            value: release.id,
            label: release.version,
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_COMPONENTS}
      resource="Release Component"
      schema={enhancedSchema}
      action={createReleaseComponentAction}
    />
  );
}
