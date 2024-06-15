ALTER TABLE "approval_group_members" ALTER COLUMN "approval_group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "approval_group_members" ALTER COLUMN "member_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "approval_groups" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "component_versions" ALTER COLUMN "component_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "components" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "environment_types" ADD COLUMN "workspace_id" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environment_types" ADD CONSTRAINT "environment_types_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
