ALTER TYPE "permission_actions" ADD VALUE 'execute';--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "permissions_version" integer DEFAULT 0 NOT NULL;