'use client';
import { createEnvironmentAction } from '@/actions/environment';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { EnvironmentType } from '@/database/schema';
import { createEnvironmentSchema } from '@/validation/environment';

export function CreateEnvironmentForm({
  environmentTypes,
}: {
  environmentTypes: EnvironmentType[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_ENVIRONMENTS}
      resource="Environment"
      schema={createEnvironmentSchema}
      action={createEnvironmentAction}
      fieldConfig={{
        typeId: {
          description: 'Type of environment we are creating',
          fieldType: 'select',

          inputProps: {
            values: environmentTypes.map((type) => ({
              value: type.id,
              label: type.label,
            })),
          },
        },
      }}
    />
  );
}
