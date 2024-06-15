'use client';
import { createComponentVersionAction } from '@/actions/components';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { Component } from '@/database/schema';
import { createComponentVersionSchema } from '@/validation/component';

export function CreateComponentVersion({
  components,
}: {
  components: Component[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_COMPONENT_VERSIONS}
      resource="Component Version"
      schema={createComponentVersionSchema}
      action={createComponentVersionAction}
      fieldConfig={{
        componentId: {
          fieldType: 'select',
          inputProps: {
            values: components.map((component) => ({
              value: component.id,
              label: component.name,
            })),
          },
        },
      }}
    />
  );
}
