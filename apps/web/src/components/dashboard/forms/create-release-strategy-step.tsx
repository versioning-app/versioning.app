'use client';
import { createReleaseStrategyStepAction } from '@/actions/release';
import { InputForm } from '@/components/dashboard/forms/generic';
import { fieldConfig } from '@/components/ui/autoform';
import { Navigation } from '@/config/navigation';
import {
  ApprovalGroup,
  Environment,
  ReleaseStrategy,
  ReleaseStrategyStep,
} from '@/database/schema';
import { enhanceFields } from '@/lib/validation';
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
  const enhancedSchema = enhanceFields(createReleaseStrategyStepSchema, {
    strategyId: {
      define: 'Release strategy for this step',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: releaseStrategies.map((step) => ({
            value: step.id,
            label: step.name,
          })),
        },
      }),
    },
    approvalGroupId: {
      define: 'Approval group required for this step',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: approvalGroups.map((group) => ({
            value: group.id,
            label: group.name,
          })),
        },
      }),
    },
    environmentId: {
      define: 'Environment for this release step',
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
    parentId: {
      define: 'Parent step (optional dependency)',
      superRefine: fieldConfig({
        fieldType: 'select',
        inputProps: {
          values: releaseStrategySteps.map((step) => ({
            value: step.id,
            label: step.name,
          })),
        },
      }),
    },
  });

  return (
    <InputForm
      postSubmitLink={Navigation.DASHBOARD_RELEASE_STRATEGY_STEPS}
      resource="Release Strategy Step"
      schema={enhancedSchema}
      action={createReleaseStrategyStepAction}
    />
  );
}
