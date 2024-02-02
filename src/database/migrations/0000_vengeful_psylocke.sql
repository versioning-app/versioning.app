DO $$ BEGIN
 CREATE TYPE "entity_type" AS ENUM('user', 'organization');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" bigserial NOT NULL,
	"type" "entity_type",
	"clerk_id" varchar(255),
	"stripe_customer_id" varchar(255)
);
