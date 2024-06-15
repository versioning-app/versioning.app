DO $$ BEGIN
 CREATE TYPE "deployment_status" AS ENUM('queued', 'cancelled', 'in_progress', 'complete', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "environment_type" AS ENUM('development', 'test', 'uat', 'nft', 'staging', 'production');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "environment_type_styles" AS ENUM('slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "gate_types" AS ENUM('approval', 'manual');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "release_status" AS ENUM('planning', 'blocked', 'scheduled', 'testing', 'complete', 'cancelled', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "release_step_actions" AS ENUM('prepare', 'deployment', 'approval_gate', 'manual_gate', 'notification');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "release_step_status" AS ENUM('pending', 'in_progress', 'complete', 'failed', 'cancelled', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "component_versions" (
	"id" varchar(128) NOT NULL,
	"component_id" varchar,
	"version" varchar(42) NOT NULL,
	"prepared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "component_versions_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deployments" (
	"id" varchar(128) NOT NULL,
	"release_step_id" varchar NOT NULL,
	"environment_id" varchar NOT NULL,
	"status" "deployment_status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deployments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environment_types" (
	"id" varchar(128) NOT NULL,
	"name" varchar(42) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "environment_types_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environments" (
	"id" varchar(128) NOT NULL,
	"name" varchar(42) NOT NULL,
	"type" "environment_type",
	"description" varchar(255),
	"workspace_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "environments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" varchar(128) NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"workspace_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "members_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(128) NOT NULL,
	"message" text NOT NULL,
	"release_step_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_components" (
	"release_id" varchar,
	"component_version_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_step_gates" (
	"id" varchar(128) NOT NULL,
	"release_step_id" varchar NOT NULL,
	"type" "gate_types" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "release_step_gates_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_steps" (
	"id" varchar(128) NOT NULL,
	"release_id" varchar,
	"strategy_step_id" varchar,
	"status" "release_step_status",
	"finalized_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "release_steps_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_strategies" (
	"id" varchar(128) NOT NULL,
	"name" varchar(42) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "release_strategies_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "release_strategy_steps" (
	"id" varchar(128) NOT NULL,
	"release_strategy_id" varchar,
	"name" varchar(42) NOT NULL,
	"description" text,
	"action" "release_step_actions" NOT NULL,
	"parent_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "release_strategy_steps_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "releases" (
	"id" varchar(128) NOT NULL,
	"date" timestamp,
	"status" "release_status",
	"version" varchar(42) NOT NULL,
	"description" text,
	"release_strategy_id" varchar,
	"workspace_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "releases_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "components" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "components" ADD COLUMN "modified_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "modified_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "component_versions" ADD CONSTRAINT "component_versions_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deployments" ADD CONSTRAINT "deployments_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deployments" ADD CONSTRAINT "deployments_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments" ADD CONSTRAINT "environments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_components" ADD CONSTRAINT "release_components_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_components" ADD CONSTRAINT "release_components_component_version_id_component_versions_id_fk" FOREIGN KEY ("component_version_id") REFERENCES "component_versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_step_gates" ADD CONSTRAINT "release_step_gates_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_steps" ADD CONSTRAINT "release_steps_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "releases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_steps" ADD CONSTRAINT "release_steps_strategy_step_id_release_strategy_steps_id_fk" FOREIGN KEY ("strategy_step_id") REFERENCES "release_strategy_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategy_steps" ADD CONSTRAINT "release_strategy_steps_release_strategy_id_release_strategies_id_fk" FOREIGN KEY ("release_strategy_id") REFERENCES "release_strategies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategy_steps" ADD CONSTRAINT "release_strategy_steps_parent_id_release_strategy_steps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "release_strategy_steps"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "releases" ADD CONSTRAINT "releases_release_strategy_id_release_strategies_id_fk" FOREIGN KEY ("release_strategy_id") REFERENCES "release_strategies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "releases" ADD CONSTRAINT "releases_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
