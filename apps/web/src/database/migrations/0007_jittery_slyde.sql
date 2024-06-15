ALTER TABLE "environments" RENAME COLUMN "type" TO "type_id";--> statement-breakpoint
ALTER TABLE "environments" DROP CONSTRAINT "environments_type_environment_types_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environments" ADD CONSTRAINT "environments_type_id_environment_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "environment_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
