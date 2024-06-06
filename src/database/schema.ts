import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
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
  'approval',
  'manual',
  'post_deployment',
  'preparation',
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

export const WORKSPACE_COLUMNS = {
  workspaceId: varchar('workspace_id')
    .references(() => workspaces.id, {
      onDelete: 'cascade',
    })
    .notNull(),
};
export const members = pgTable(
  'members',
  {
    id: identifierColumn(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull(),
    ...WORKSPACE_COLUMNS,
    ...TIME_COLUMNS,
  },
  (table) => ({
    unq: unique().on(table.clerkId, table.workspaceId),
  }),
);

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export const approval_groups = pgTable('approval_groups', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  ...WORKSPACE_COLUMNS,
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
  ...WORKSPACE_COLUMNS,
  ...TIME_COLUMNS,
});

export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;

export const component_versions = pgTable('component_versions', {
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

export type ComponentVersion = typeof component_versions.$inferSelect;
export type NewComponentVersion = typeof component_versions.$inferInsert;

export const environment_types = pgTable('environment_types', {
  id: identifierColumn(),
  label: varchar('name', { length: 42 }).notNull(),
  description: varchar('description', { length: 255 }),
  style: environment_type_styles('style').notNull(),
  ...WORKSPACE_COLUMNS,
  ...TIME_COLUMNS,
});

export type EnvironmentType = typeof environment_types.$inferSelect;
export type NewEnvironmentType = typeof environment_types.$inferInsert;

export const environments = pgTable('environments', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  typeId: varchar('type_id')
    .references(() => environment_types.id, { onDelete: 'cascade' })
    .notNull(),
  description: varchar('description', { length: 255 }),
  ...WORKSPACE_COLUMNS,
  ...TIME_COLUMNS,
});

export type Environment = typeof environments.$inferSelect;
export type NewEnvironment = typeof environments.$inferInsert;

export const environmentTypeRelations = relations(
  environment_types,
  ({ many }) => ({
    environments: many(environments),
  }),
);

export const release_strategies = pgTable('release_strategies', {
  id: identifierColumn(),
  name: varchar('name', { length: 42 }).notNull(),
  description: text('description'),
  ...WORKSPACE_COLUMNS,
  ...TIME_COLUMNS,
});

export type ReleaseStrategy = typeof release_strategies.$inferSelect;
export type NewReleaseStrategy = typeof release_strategies.$inferInsert;

export const release_strategy_steps = pgTable('release_strategy_steps', {
  id: identifierColumn(),
  strategyId: varchar('release_strategy_id').references(
    () => release_strategies.id,
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
    (): AnyPgColumn => release_strategy_steps.id,
    { onDelete: 'cascade' },
  ),
  ...TIME_COLUMNS,
});

export type ReleaseStrategyStep = typeof release_strategy_steps.$inferSelect;
export type NewReleaseStrategyStep = typeof release_strategy_steps.$inferInsert;

export const releases = pgTable('releases', {
  id: identifierColumn(),
  date: timestamp('date'),
  status: release_status('status'),
  version: varchar('version', { length: 42 }).notNull(),
  description: text('description'),
  strategyId: varchar('release_strategy_id')
    .references(() => release_strategies.id, { onDelete: 'cascade' })
    .notNull(),
  ...WORKSPACE_COLUMNS,
  ...TIME_COLUMNS,
});

export type Release = typeof releases.$inferSelect;
export type NewRelease = typeof releases.$inferInsert;

export const release_components = pgTable('release_components', {
  releaseId: varchar('release_id')
    .references(() => releases.id, { onDelete: 'cascade' })
    .notNull(),
  componentVersionId: varchar('component_version_id')
    .references(() => component_versions.id, { onDelete: 'cascade' })
    .notNull(),
  active: boolean('active').notNull().default(false),
  ...TIME_COLUMNS,
});

export type ReleaseComponentVersion = typeof release_components.$inferSelect;
export type NewReleaseComponentVersion = typeof release_components.$inferInsert;

export const release_steps = pgTable('release_steps', {
  id: identifierColumn(),
  releaseId: varchar('release_id')
    .references(() => releases.id, { onDelete: 'cascade' })
    .notNull(),
  releaseStrategyStepId: varchar('release_strategy_step_id')
    .references(() => release_strategy_steps.id, { onDelete: 'cascade' })
    .notNull(),
  status: release_step_status('status').notNull(),
  finalizedAt: timestamp('finalized_at'),
  ...TIME_COLUMNS,
});

export type ReleaseStep = typeof release_steps.$inferSelect;
export type NewReleaseStep = typeof release_steps.$inferInsert;

export const deployments = pgTable('deployments', {
  id: identifierColumn(),
  releaseStepId: varchar('release_step_id')
    .references(() => release_steps.id, { onDelete: 'cascade' })
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
    .references(() => release_steps.id, { onDelete: 'cascade' })
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
    .references(() => release_steps.id, { onDelete: 'cascade' })
    .notNull(),
  ...TIME_COLUMNS,
});

export const approvals_relations = relations(approvals, ({ one }) => ({
  release_step: one(release_steps, {
    fields: [approvals.releaseStepId],
    references: [release_steps.id],
  }),
  member: one(members, {
    fields: [approvals.member_id],
    references: [members.id],
  }),
}));

export const release_stepsRelations = relations(
  release_steps,
  ({ one, many }) => ({
    approvals: many(approvals),
    deployments: many(deployments),
    release: one(releases, {
      fields: [release_steps.releaseId],
      references: [releases.id],
    }),
    release_strategy_step: one(release_strategy_steps, {
      fields: [release_steps.releaseStrategyStepId],
      references: [release_strategy_steps.id],
    }),
    notifications: many(notifications),
  }),
);

export const membersRelations = relations(members, ({ one, many }) => ({
  approvals: many(approvals),
  approval_group_members: many(approval_group_members),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}));

export const approval_group_membersRelations = relations(
  approval_group_members,
  ({ one }) => ({
    member: one(members, {
      fields: [approval_group_members.memberId],
      references: [members.id],
    }),
    approval_group: one(approval_groups, {
      fields: [approval_group_members.groupId],
      references: [approval_groups.id],
    }),
  }),
);

export const approval_groupsRelations = relations(
  approval_groups,
  ({ one, many }) => ({
    approval_group_members: many(approval_group_members),
    workspace: one(workspaces, {
      fields: [approval_groups.workspaceId],
      references: [workspaces.id],
    }),
    release_strategy_steps: many(release_strategy_steps),
  }),
);

export const release_strategiesRelations = relations(
  release_strategies,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [release_strategies.workspaceId],
      references: [workspaces.id],
    }),
    releases: many(releases),
    release_strategy_steps: many(release_strategy_steps),
  }),
);

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  release_strategies: many(release_strategies),
  releases: many(releases),
  components: many(components),
  environment_types: many(environment_types),
  environments: many(environments),
  members: many(members),
  approval_groups: many(approval_groups),
}));

export const releasesRelations = relations(releases, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [releases.workspaceId],
    references: [workspaces.id],
  }),
  release_strategy: one(release_strategies, {
    fields: [releases.strategyId],
    references: [release_strategies.id],
  }),
  release_components: many(release_components),
  release_steps: many(release_steps),
}));

export const componentsRelations = relations(components, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [components.workspaceId],
    references: [workspaces.id],
  }),
  component_versions: many(component_versions),
}));

export const environment_typesRelations = relations(
  environment_types,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [environment_types.workspaceId],
      references: [workspaces.id],
    }),
    environments: many(environments),
  }),
);

export const environmentsRelations = relations(
  environments,
  ({ one, many }) => ({
    workspace: one(workspaces, {
      fields: [environments.workspaceId],
      references: [workspaces.id],
    }),
    environment_type: one(environment_types, {
      fields: [environments.typeId],
      references: [environment_types.id],
    }),
    deployments: many(deployments),
    release_strategy_steps: many(release_strategy_steps),
  }),
);

export const component_versionsRelations = relations(
  component_versions,
  ({ one, many }) => ({
    component: one(components, {
      fields: [component_versions.componentId],
      references: [components.id],
    }),
    release_components: many(release_components),
  }),
);

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  environment: one(environments, {
    fields: [deployments.environmentId],
    references: [environments.id],
  }),
  release_step: one(release_steps, {
    fields: [deployments.releaseStepId],
    references: [release_steps.id],
  }),
}));

export const release_componentRelations = relations(
  release_components,
  ({ one }) => ({
    component_version: one(component_versions, {
      fields: [release_components.componentVersionId],
      references: [component_versions.id],
    }),
    release: one(releases, {
      fields: [release_components.releaseId],
      references: [releases.id],
    }),
  }),
);

export const release_strategy_stepsRelations = relations(
  release_strategy_steps,
  ({ one, many }) => ({
    release_steps: many(release_steps),
    release_strategy_step: one(release_strategy_steps, {
      fields: [release_strategy_steps.parentId],
      references: [release_strategy_steps.id],
      relationName:
        'release_strategy_steps_parent_id_release_strategy_steps_id',
    }),
    release_strategy_steps: many(release_strategy_steps, {
      relationName:
        'release_strategy_steps_parent_id_release_strategy_steps_id',
    }),
    environment: one(environments, {
      fields: [release_strategy_steps.environmentId],
      references: [environments.id],
    }),
    release_strategy: one(release_strategies, {
      fields: [release_strategy_steps.strategyId],
      references: [release_strategies.id],
    }),
    approval_group: one(approval_groups, {
      fields: [release_strategy_steps.approvalGroupId],
      references: [approval_groups.id],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  release_step: one(release_steps, {
    fields: [notifications.releaseStepId],
    references: [release_steps.id],
  }),
}));
