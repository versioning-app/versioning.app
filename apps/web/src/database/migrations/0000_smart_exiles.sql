DO $$ BEGIN
 CREATE TYPE "workspace_type" AS ENUM('user', 'organization');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "components" (
	"id" varchar(128) NOT NULL,
	"name" varchar(42) NOT NULL,
	"description" varchar(255),
	"workspace_id" varchar,
	CONSTRAINT "components_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" varchar(128) NOT NULL,
	"type" "workspace_type",
	"slug" varchar(42) NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255),
	CONSTRAINT "workspaces_id_unique" UNIQUE("id"),
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
