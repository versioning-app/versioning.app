ALTER TABLE "release_step_approval_log" RENAME TO "approvals";--> statement-breakpoint
ALTER TABLE "approvals" DROP CONSTRAINT "release_step_approval_log_id_unique";--> statement-breakpoint
ALTER TABLE "approvals" DROP CONSTRAINT "release_step_approval_log_release_step_id_release_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "approvals" DROP CONSTRAINT "release_step_approval_log_member_id_members_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approvals" ADD CONSTRAINT "approvals_release_step_id_release_steps_id_fk" FOREIGN KEY ("release_step_id") REFERENCES "release_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approvals" ADD CONSTRAINT "approvals_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_id_unique" UNIQUE("id");