'use client';
import { createReleaseStepAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import { Release, ReleaseStrategyStep } from '@/database/schema';
import { enhanceFields } from '@/lib/validation';
import { createReleaseStepSchema } from '@/validation/release';

export function CreateReleaseStepForm({
  releases,
  releaseStrategySteps,
}: {
  releases: Release[];
  releaseStrategySteps: ReleaseStrategyStep[];
}) {
  const enhancedSchema = enhanceFields(createReleaseStepSchema, {
    releaseId: {
      define: 'Release for this step',
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
    releaseStrategyStepId: {
      define: 'Strategy step to execute',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: releaseStrategySteps.map((step) => ({
            value: step.id,
            label: step.name,
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_STEPS}
      resource="Release Step"
      schema={enhancedSchema}
      action={createReleaseStepAction}
    />
  );
}
