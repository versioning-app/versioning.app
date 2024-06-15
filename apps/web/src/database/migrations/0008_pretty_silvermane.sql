ALTER TABLE "release_strategy_steps" ADD COLUMN "environment_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "release_strategy_steps" ADD COLUMN "approval_group_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategy_steps" ADD CONSTRAINT "release_strategy_steps_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "environments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategy_steps" ADD CONSTRAINT "release_strategy_steps_approval_group_id_approval_groups_id_fk" FOREIGN KEY ("approval_group_id") REFERENCES "approval_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
