'use client';
import { createComponentVersionAction } from '@/actions/components';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import { Component } from '@/database/schema';
import { enhanceFields } from '@/lib/validation';
import { createComponentVersionSchema } from '@/validation/component';

export function CreateComponentVersion({
  components,
}: {
  components: Component[];
}) {
  const enhancedSchema = enhanceFields(createComponentVersionSchema, {
    componentId: {
      define: 'Component to create version for',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: components.map((component) => ({
            value: component.id,
            label: component.name,
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_COMPONENT_VERSIONS}
      resource="Component Version"
      schema={enhancedSchema}
      action={createComponentVersionAction}
    />
  );
}
