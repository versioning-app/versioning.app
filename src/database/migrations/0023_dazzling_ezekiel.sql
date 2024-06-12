CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" varchar(128) NOT NULL,
	"key" varchar(128) NOT NULL,
	"expires_at" timestamp,
	"description" text,
	"workspace_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_id_unique" UNIQUE("id"),
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
