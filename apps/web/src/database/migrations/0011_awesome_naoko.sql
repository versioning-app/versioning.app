ALTER TABLE "release_components" ADD COLUMN "current" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "release_components" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "release_components" ADD COLUMN "modified_at" timestamp DEFAULT now() NOT NULL;