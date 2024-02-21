ALTER TABLE "release_step_gates" RENAME TO "release_step_approval_log";--> statement-breakpoint
ALTER TABLE "release_step_approval_log" DROP CONSTRAINT "release_step_gates_id_unique";--> statement-breakpoint
ALTER TABLE "release_step_approval_log" DROP CONSTRAINT "release_step_gates_release_step_id_release_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "release_step_approval_log" ADD COLUMN "approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "release_step_approval_log" ADD COLUMN "comments" text;--> statement-breakpoint
ALTER TABLE "release_step_approval_log" ADD COLUMN "member_id" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_step_approval_log" ADD CONSTRAINT "release_step_approval_log_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_step_approval_log" ADD CONSTRAINT "release_step_approval_log_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "release_step_approval_log" ADD CONSTRAINT "release_step_approval_log_id_unique" UNIQUE("id");