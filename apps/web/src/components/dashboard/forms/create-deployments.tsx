'use client';
import { createDeploymentAction } from '@/actions/deployment';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import { Environment, ReleaseStep } from '@/database/schema';
import { enhanceFields } from '@/lib/validation';
import { createDeploymentsSchema } from '@/validation/deployment';

export function CreateDeploymentForm({
  environments,
  releaseSteps,
}: {
  environments: Environment[];
  releaseSteps: ReleaseStep[];
}) {
  const enhancedSchema = enhanceFields(createDeploymentsSchema, {
    environmentId: {
      define: 'Environment to deploy to',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: environments.map((environment) => ({
            value: environment.id,
            label: environment.name,
          })),
        },
      }),
    },
    releaseStepId: {
      define: 'Release step to deploy',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: releaseSteps.map((step) => ({
            value: step.id,
            label: `${step.id} (${step.status})`,
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_DEPLOYMENTS}
      resource="Deployment"
      schema={enhancedSchema}
      action={createDeploymentAction}
    />
  );
}
