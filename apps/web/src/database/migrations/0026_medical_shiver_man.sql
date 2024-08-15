DO $$ BEGIN
 CREATE TYPE "public"."permission_actions" AS ENUM('read', 'create', 'update', 'delete', 'manage');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "action" "permission_actions" NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN IF EXISTS "description";