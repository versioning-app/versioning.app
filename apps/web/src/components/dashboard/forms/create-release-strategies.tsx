'use client';
import { createReleaseStrategyAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { createReleaseStrategySchema } from '@/validation/release';

export function CreateReleaseStrategiesForm() {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_STRATEGIES}
      resource="Release Strategy"
      schema={createReleaseStrategySchema}
      action={createReleaseStrategyAction}
    />
  );
}
