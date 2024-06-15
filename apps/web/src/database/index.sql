CREATE INDEX IF NOT EXISTS ON public.release_strategy_steps USING btree (parent_id);
CREATE INDEX IF NOT EXISTS ON public.releases USING btree (release_strategy_id, id);
CREATE INDEX IF NOT EXISTS ON public.release_steps USING btree (release_strategy_step_id, id);