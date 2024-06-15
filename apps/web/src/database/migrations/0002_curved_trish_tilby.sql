ALTER TABLE "environments" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "environments" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "environments" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "release_components" ALTER COLUMN "release_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "release_components" ALTER COLUMN "component_version_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "release_steps" ALTER COLUMN "release_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "release_steps" ALTER COLUMN "strategy_step_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "release_steps" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "releases" ALTER COLUMN "release_strategy_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "releases" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments" ADD CONSTRAINT "environments_type_environment_types_id_fk" FOREIGN KEY ("type") REFERENCES "environment_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
