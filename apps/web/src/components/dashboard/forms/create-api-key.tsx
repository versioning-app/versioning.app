'use client';
import { createApiKeyAction } from '@/actions/api-keys';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { createApiKeySchema } from '@/validation/api-keys';

export function CreateApiKey() {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_API_KEYS}
      resource="Api Key"
      schema={createApiKeySchema}
      action={createApiKeyAction}
    />
  );
}
