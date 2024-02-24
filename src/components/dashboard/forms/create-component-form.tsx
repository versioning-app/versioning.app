'use client';
import { createComponentAction } from '@/actions/components';
import { InputForm } from '@/components/dashboard/forms/input-form';
import { Navigation } from '@/config/navigation';
import { createComponentSchema } from '@/validation/component';

export function CreateComponentForm() {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_COMPONENTS}
      resource="Component"
      schema={createComponentSchema}
      action={createComponentAction}
      fieldConfig={{
        name: {
          description: 'Name of the component we are creating',
          inputProps: {
            placeholder: 'Component name',
          },
        },
        description: {
          description: 'Explanation of what the component does',
          fieldType: 'textarea',
          inputProps: {
            placeholder: 'Component description',
          },
        },
      }}
    />
  );
}
