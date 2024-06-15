CREATE TABLE IF NOT EXISTS "approval_group_members" (
	"approval_group_id" varchar,
	"member_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "approval_groups" (
	"id" varchar(128) NOT NULL,
	"name" varchar(42) NOT NULL,
	"description" varchar(255),
	"workspace_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "approval_groups_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "component_versions" DROP CONSTRAINT "component_versions_component_id_components_id_fk";
--> statement-breakpoint
ALTER TABLE "components" DROP CONSTRAINT "components_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "deployments" DROP CONSTRAINT "deployments_release_step_id_release_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "environments" DROP CONSTRAINT "environments_type_environment_types_id_fk";
--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_release_step_id_release_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "release_components" DROP CONSTRAINT "release_components_release_id_releases_id_fk";
--> statement-breakpoint
ALTER TABLE "release_step_gates" DROP CONSTRAINT "release_step_gates_release_step_id_release_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "release_steps" DROP CONSTRAINT "release_steps_release_id_releases_id_fk";
--> statement-breakpoint
ALTER TABLE "release_strategies" DROP CONSTRAINT "release_strategies_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "release_strategy_steps" DROP CONSTRAINT "release_strategy_steps_release_strategy_id_release_strategies_id_fk";
--> statement-breakpoint
ALTER TABLE "releases" DROP CONSTRAINT "releases_release_strategy_id_release_strategies_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "component_versions" ADD CONSTRAINT "component_versions_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deployments" ADD CONSTRAINT "deployments_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments" ADD CONSTRAINT "environments_type_environment_types_id_fk" FOREIGN KEY ("type") REFERENCES "environment_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_components" ADD CONSTRAINT "release_components_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_step_gates" ADD CONSTRAINT "release_step_gates_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_steps" ADD CONSTRAINT "release_steps_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategies" ADD CONSTRAINT "release_strategies_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategy_steps" ADD CONSTRAINT "release_strategy_steps_release_strategy_id_release_strategies_id_fk" FOREIGN KEY ("release_strategy_id") REFERENCES "release_strategies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "releases" ADD CONSTRAINT "releases_release_strategy_id_release_strategies_id_fk" FOREIGN KEY ("release_strategy_id") REFERENCES "release_strategies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approval_group_members" ADD CONSTRAINT "approval_group_members_approval_group_id_approval_groups_id_fk" FOREIGN KEY ("approval_group_id") REFERENCES "approval_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approval_group_members" ADD CONSTRAINT "approval_group_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approval_groups" ADD CONSTRAINT "approval_groups_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
