CREATE TABLE IF NOT EXISTS "components" (
	"id" bigserial NOT NULL,
	"name" varchar(42) NOT NULL,
	"description" varchar(255),
	"entity_id" bigserial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entities" ALTER COLUMN "clerk_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
