ALTER TABLE "release_strategies" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "release_strategies" ADD COLUMN "workspace_id" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_strategies" ADD CONSTRAINT "release_strategies_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
