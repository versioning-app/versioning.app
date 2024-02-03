DO $$ BEGIN
 CREATE TYPE "entity_type" AS ENUM('user', 'organization');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "components" (
	"id" serial NOT NULL,
	"name" varchar(42) NOT NULL,
	"description" varchar(255),
	"entity_id" integer,
	CONSTRAINT "components_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" serial NOT NULL,
	"type" "entity_type",
	"clerk_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255),
	CONSTRAINT "entities_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "components" ADD CONSTRAINT "components_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
