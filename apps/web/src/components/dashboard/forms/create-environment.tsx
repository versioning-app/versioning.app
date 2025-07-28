'use client';
import { createEnvironmentAction } from '@/actions/environment';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import { EnvironmentType } from '@/database/schema';
import { enhanceFields } from '@/lib/validation';
import { createEnvironmentSchema } from '@/validation/environment';

export function CreateEnvironmentForm({
  environmentTypes,
}: {
  environmentTypes: EnvironmentType[];
}) {
  const enhancedSchema = enhanceFields(createEnvironmentSchema, {
    typeId: {
      define: 'Type of environment we are creating',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: environmentTypes.map((type) => ({
            value: type.id,
            label: type.label,
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_ENVIRONMENTS}
      resource="Environment"
      schema={enhancedSchema}
      action={createEnvironmentAction}
    />
  );
}
