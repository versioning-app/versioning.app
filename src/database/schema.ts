import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// -- Utils
const identifierColumn = () =>
  varchar('id', { length: 128 })
    .notNull()
    .unique()
    .$defaultFn(() => createId());

// -- Enums
export const WorkspaceType = ['user', 'organization'] as const;

export const workspace_type = pgEnum('workspace_type', WorkspaceType);

export const ReleaseStepActions = [
  'prepare',
  'deployment',
  'approval_gate',
] as const;

export const release_step_actions = pgEnum(
  'release_step_actions',
  ReleaseStepActions,
);

export const ReleaseStepStatus = [
  'pending',
  'in_progress',
  'complete',
  'failed',
  'cancelled',
  'archived',
] as const;

export const release_step_status = pgEnum(
  'release_step_status',
  ReleaseStepStatus,
);

export const ApprovalTypes = [
  'preparation',
  'post_deployment',
  'approval_gate',
] as const;

export const approval_types = pgEnum('gate_types', ApprovalTypes);

export const ReleaseStatus = [
  'planning',
  'blocked',
  'scheduled',
  'testing',
  'complete',
  'cancelled',
  'archived',
] as const;

export const release_status = pgEnum('release_status', ReleaseStatus);

export const DeploymentStatus = [
  'queued',
  'cancelled',
  'in_progress',
  'complete',
  'failed',
] as const;

export const deployment_status = pgEnum('deployment_status', DeploymentStatus);

export const EnvironmentTypeStyles = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;

export const environment_type_styles = pgEnum(
  'environment_type_styles',
  EnvironmentTypeStyles,
);

// -- Shared common columns
const TIME_COLUMNS = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  modifiedAt: timestamp('modified_at').defaultNow().notNull(),
};

// -- Tables
export const workspaces = pgTable('workspaces', {
  id: identifierColumn(),
  type: workspace_type('type'),
  slug: varchar('slug', { length: 42 }).notNull().unique(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  ...TIME_COLUMNS,
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export const members = pgTable('members', {
  id: identifierColumn(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  ...TIME_COLUMNS,
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export const approval_groups = pgTable('approval_groups', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  ...TIME_COLUMNS,
});

export type ApprovalGroup = typeof approval_groups.$inferSelect;
export type NewApprovalGroup = typeof approval_groups.$inferInsert;

export const approval_group_members = pgTable('approval_group_members', {
  groupId: varchar('approval_group_id')
    .references(() => approval_groups.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  memberId: varchar('member_id')
    .references(() => members.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  ...TIME_COLUMNS,
});

export const components = pgTable('components', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  ...TIME_COLUMNS,
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;

export const componentVersions = pgTable('component_versions', {
  id: identifierColumn(),
  componentId: varchar('component_id')
    .references(() => components.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  version: varchar('version', { length: 42 }).notNull(),
  prepared: boolean('prepared').notNull().default(false),
  ...TIME_COLUMNS,
});

export type ComponentVersion = typeof componentVersions.$inferSelect;
export type NewComponentVersion = typeof componentVersions.$inferInsert;

export const environmentTypes = pgTable('environment_types', {
  id: identifierColumn(),
  label: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  style: environment_type_styles('style').notNull(),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  ...TIME_COLUMNS,
});

export type EnvironmentType = typeof environmentTypes.$inferSelect;
export type NewEnvironmentType = typeof environmentTypes.$inferInsert;

export const environments = pgTable('environments', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  typeId: varchar('type_id')
    .references(() => environmentTypes.id, { onDelete: 'cascade' })
    .notNull(),
  description: varchar('description', { length: 255 }),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  ...TIME_COLUMNS,
});

export type Environment = typeof environments.$inferSelect;
export type NewEnvironment = typeof environments.$inferInsert;

export const environmentTypeRelations = relations(
  environmentTypes,
  ({ many }) => ({
    environments: many(environments),
  }),
);

export const environmentRelations = relations(environments, ({ one }) => ({
  type: one(environmentTypes, {
    fields: [environments.typeId],
    references: [environmentTypes.id],
  }),
}));

export const releaseStrategies = pgTable('release_strategies', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  description: text('description'),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  ...TIME_COLUMNS,
});

export type ReleaseStrategy = typeof releaseStrategies.$inferSelect;
export type NewReleaseStrategy = typeof releaseStrategies.$inferInsert;

export const releaseStrategySteps = pgTable('release_strategy_steps', {
  id: identifierColumn(),
  strategyId: varchar('release_strategy_id').references(
    () => releaseStrategies.id,
    { onDelete: 'cascade' },
  ),
  name: varchar('name', { length: 42 }).notNull(),
  description: text('description'),
  action: release_step_actions('action').notNull(),
  // Used for deployments to indicate the environment to deploy to
  environmentId: varchar('environment_id').references(() => environments.id, {
    onDelete: 'cascade',
  }),
  // Used for approval gates to indicate the approval group to use
  approvalGroupId: varchar('approval_group_id').references(
    () => approval_groups.id,
    { onDelete: 'cascade' },
  ),
  parentId: varchar('parent_id').references(
    (): AnyPgColumn => releaseStrategySteps.id,
    { onDelete: 'cascade' },
  ),
  ...TIME_COLUMNS,
});

export type ReleaseStrategyStep = typeof releaseStrategySteps.$inferSelect;
export type NewReleaseStrategyStep = typeof releaseStrategySteps.$inferInsert;

export const releases = pgTable('releases', {
  id: identifierColumn(),
  date: timestamp('date'),
  status: release_status('status'),
  version: varchar('version', { length: 42 }),
  description: text('description'),
  strategyId: varchar('release_strategy_id')
    .references(() => releaseStrategies.id, { onDelete: 'cascade' })
    .notNull(),
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull(),
  ...TIME_COLUMNS,
});

export type Release = typeof releases.$inferSelect;
export type NewRelease = typeof releases.$inferInsert;

export const releaseComponentVersions = pgTable('release_components', {
  releaseId: varchar('release_id')
    .references(() => releases.id, { onDelete: 'cascade' })
    .notNull(),
  componentVersionId: varchar('component_version_id')
    .references(() => componentVersions.id, { onDelete: 'cascade' })
    .notNull(),
  active: boolean('active').notNull().default(false),
  ...TIME_COLUMNS,
});

export type ReleaseComponentVersion =
  typeof releaseComponentVersions.$inferSelect;
export type NewReleaseComponentVersion =
  typeof releaseComponentVersions.$inferInsert;

export const releaseSteps = pgTable('release_steps', {
  id: identifierColumn(),
  releaseId: varchar('release_id')
    .references(() => releases.id, { onDelete: 'cascade' })
    .notNull(),
  releaseStrategyStepId: varchar('release_strategy_step_id')
    .references(() => releaseStrategySteps.id, { onDelete: 'cascade' })
    .notNull(),
  status: release_step_status('status').notNull(),
  finalizedAt: timestamp('finalized_at'),
  ...TIME_COLUMNS,
});

export type ReleaseStep = typeof releaseSteps.$inferSelect;
export type NewReleaseStep = typeof releaseSteps.$inferInsert;

export const deployments = pgTable('deployments', {
  id: identifierColumn(),
  releaseStepId: varchar('release_step_id')
    .references(() => releaseSteps.id, { onDelete: 'cascade' })
    .notNull(),
  environmentId: varchar('environment_id')
    .references(() => environments.id, { onDelete: 'cascade' })
    .notNull(),
  status: deployment_status('status'),
  ...TIME_COLUMNS,
});

export type Deployment = typeof deployments.$inferSelect;
export type NewDeployment = typeof deployments.$inferInsert;

export const approvals = pgTable('approvals', {
  id: identifierColumn(),
  releaseStepId: varchar('release_step_id')
    .references(() => releaseSteps.id, { onDelete: 'cascade' })
    .notNull(),
  type: approval_types('type').notNull(),
  // False if the approval was rejected
  approved: boolean('approved').notNull().default(false),
  comments: text('comments'),
  member_id: varchar('member_id')
    .references(() => members.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  ...TIME_COLUMNS,
});

export const notifications = pgTable('notifications', {
  id: identifierColumn(),
  message: text('message').notNull(),
  releaseStepId: varchar('release_step_id')
    .references(() => releaseSteps.id, { onDelete: 'cascade' })
    .notNull(),
  ...TIME_COLUMNS,
});
