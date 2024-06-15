WITH RECURSIVE release_strategy_steps_hierarchy AS (
  SELECT id, name, release_strategy_id, parent_id, 1 AS level
  FROM release_strategy_steps
  WHERE parent_id IS NULL
  UNION ALL
  SELECT RSS.id, RSS.name, RSS.release_strategy_id, RSS.parent_id, RSSH.level + 1
  FROM release_strategy_steps RSS
  JOIN release_strategy_steps_hierarchy RSSH ON RSS.parent_id = RSSH.id
)
SELECT RSSH.id, RSSH.name, RSSH.release_strategy_id, RSSH.parent_id, RSSH.level, STEPS.status as status
FROM release_strategy_steps_hierarchy RSSH
INNER JOIN release_strategies RS ON (RS.id = RSSH.release_strategy_id)
INNER JOIN releases R ON (R.release_strategy_id = RS.id)
LEFT OUTER JOIN release_steps STEPS on (STEPS.release_strategy_step_id = RSSH.id AND R.id = STEPS.release_id)
WHERE R.id = 'release_4'
ORDER BY RSSH.release_strategy_id, RSSH.level;