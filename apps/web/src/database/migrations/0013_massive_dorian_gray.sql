ALTER TABLE "release_steps" RENAME COLUMN "strategy_step_id" TO "release_strategy_step_id";--> statement-breakpoint
ALTER TABLE "release_steps" DROP CONSTRAINT "release_steps_strategy_step_id_release_strategy_steps_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "release_steps" ADD CONSTRAINT "release_steps_release_strategy_step_id_release_strategy_steps_id_fk" FOREIGN KEY ("release_strategy_step_id") REFERENCES "release_strategy_steps"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
