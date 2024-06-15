'use client';
import { createEnvironmentTypeAction } from '@/actions/environment';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { createEnvironmentTypeSchema } from '@/validation/environment';

export function CreateEnvironmentTypeForm() {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_ENVIRONMENT_TYPES}
      resource="Environment Type"
      schema={createEnvironmentTypeSchema}
      action={createEnvironmentTypeAction}
    />
  );
}
