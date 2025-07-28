'use client';
import { createReleaseAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import { ReleaseStatus, ReleaseStrategy } from '@/database/schema';
import { capitalizeFirstLetter } from '@/lib/utils';
import { enhanceFields } from '@/lib/validation';
import { createReleaseSchema } from '@/validation/release';

export function CreateReleaseForm({
  releaseStrategies,
}: {
  releaseStrategies: ReleaseStrategy[];
}) {
  const enhancedSchema = enhanceFields(createReleaseSchema, {
    strategyId: {
      define: 'Strategy for the release',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: releaseStrategies.map((strategy) => ({
            value: strategy.id,
            label: strategy.name,
          })),
        },
      }),
    },
    status: {
      define: 'Status of the release',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: ReleaseStatus.map((status) => ({
            value: status,
            label: capitalizeFirstLetter(status),
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASES}
      resource="Release"
      schema={enhancedSchema}
      action={createReleaseAction}
    />
  );
}
