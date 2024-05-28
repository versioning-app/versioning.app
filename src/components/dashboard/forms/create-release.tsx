'use client';
import { createReleaseAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { ReleaseStatus, ReleaseStrategy } from '@/database/schema';
import { capitalizeFirstLetter } from '@/lib/utils';
import { createReleaseSchema } from '@/validation/release';

export function CreateReleaseForm({
  releaseStrategies,
}: {
  releaseStrategies: ReleaseStrategy[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASES}
      resource="Release"
      schema={createReleaseSchema}
      action={createReleaseAction}
      fieldConfig={{
        strategyId: {
          fieldType: 'select',
          inputProps: {
            values: releaseStrategies.map((strategy) => ({
              value: strategy.id,
              label: strategy.name,
            })),
          },
        },
        status: {
          fieldType: 'select',
          inputProps: {
            values: ReleaseStatus.map((status) => ({
              value: status,
              label: capitalizeFirstLetter(status),
            })),
          },
        },
      }}
    />
  );
}
