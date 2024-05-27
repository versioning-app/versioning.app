CREATE TABLE IF NOT EXISTS "with_workspace" (
	"workspace_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "releases" ALTER COLUMN "version" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "with_workspace" ADD CONSTRAINT "with_workspace_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
