'use client';
import { createReleaseStepAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { Release, ReleaseStrategyStep } from '@/database/schema';
import { createReleaseStepSchema } from '@/validation/release';

export function CreateReleaseStepForm({
  releases,
  releaseStrategySteps,
}: {
  releases: Release[];
  releaseStrategySteps: ReleaseStrategyStep[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_STEPS}
      resource="Release Step"
      schema={createReleaseStepSchema}
      action={createReleaseStepAction}
      fieldConfig={{
        releaseId: {
          fieldType: 'select',
          inputProps: {
            values: releases.map((release) => ({
              value: release.id,
              label: release.version,
            })),
          },
        },
        releaseStrategyStepId: {
          fieldType: 'select',
          inputProps: {
            values: releaseStrategySteps.map((step) => ({
              value: step.id,
              label: step.name,
            })),
          },
        },
      }}
    />
  );
}
