CREATE TABLE IF NOT EXISTS "leads" (
	"id" varchar(128) NOT NULL,
	"email" varchar(255) NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"modified_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leads_id_unique" UNIQUE("id"),
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
