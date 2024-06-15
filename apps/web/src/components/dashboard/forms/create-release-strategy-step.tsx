'use client';
import { createReleaseStrategyStepAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { Navigation } from '@/config/navigation';
import {
  ApprovalGroup,
  Environment,
  ReleaseStrategy,
  ReleaseStrategyStep,
} from '@/database/schema';
import { createReleaseStrategyStepSchema } from '@/validation/release';

export function CreateReleaseStrategyStepForm({
  environments,
  releaseStrategySteps,
  approvalGroups,
  releaseStrategies,
}: {
  environments: Environment[];
  releaseStrategySteps: ReleaseStrategyStep[];
  approvalGroups: ApprovalGroup[];
  releaseStrategies: ReleaseStrategy[];
}) {
  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS}
      resource="Release Strategy Step"
      schema={createReleaseStrategyStepSchema}
      action={createReleaseStrategyStepAction}
      fieldConfig={{
        strategyId: {
          fieldType: 'select',
          inputProps: {
            values: releaseStrategies.map((step) => ({
              value: step.id,
              label: step.name,
            })),
          },
        },
        approvalGroupId: {
          fieldType: 'select',
          inputProps: {
            values: approvalGroups.map((group) => ({
              value: group.id,
              label: group.name,
            })),
          },
        },
        environmentId: {
          fieldType: 'select',
          inputProps: {
            values: environments.map((environment) => ({
              value: environment.id,
              label: environment.name,
            })),
          },
        },
        parentId: {
          fieldType: 'select',
          inputProps: {
            values: releaseStrategySteps.map((step) => ({
              value: step.id,
              label: step.name,
            })),
          },
        },
      }}
    />
  );
}
