'use client';
import { createDeploymentAction } from '@/actions/deployment';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import { Environment, ReleaseStep } from '@/database/schema';
import { createDeploymentsSchema } from '@/validation/deployment';

export function CreateDeploymentForm({
  environments,
  releaseSteps,
}: {
  environments: Environment[];
  releaseSteps: ReleaseStep[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_DEPLOYMENTS}
      resource="Deployment"
      schema={createDeploymentsSchema}
      action={createDeploymentAction}
      fieldConfig={{
        environmentId: {
          fieldType: 'select',
          inputProps: {
            values: environments.map((environment) => ({
              value: environment.id,
              label: environment.name,
            })),
          },
        },
        releaseStepId: {
          fieldType: 'select',
          inputProps: {
            values: releaseSteps.map((step) => ({
              value: step.id,
              label: `${step.id} (${step.status})`,
            })),
          },
        },
      }}
    />
  );
}
