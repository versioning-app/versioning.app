-- Reset data
TRUNCATE environments CASCADE;
TRUNCATE release_strategy_steps CASCADE;
TRUNCATE workspaces CASCADE;

INSERT INTO workspaces (id, type, slug, clerk_id) 
VALUES ('workspace_1', 'organization', 'example_workspace', 'org_abc123');

INSERT INTO members (id, clerk_id, workspace_id)
VALUES 
('developer_1', 'user_dev', 'workspace_1'),
('tester_1', 'user_test', 'workspace_1'),
('uat_1', 'user_uat', 'workspace_1'),
('staging_1', 'user_staging', 'workspace_1'),
('production_1', 'user_production', 'workspace_1');

INSERT INTO approval_groups (id, name, description, workspace_id)
VALUES
('dev_approval_group_1', 'Developers', 'Developer approval group', 'workspace_1'),
('test_approval_group_1', 'Testers', 'Testing approval group', 'workspace_1'),
('uat_approval_group_1', 'UAT', 'UAT approval group', 'workspace_1'),
('staging_approval_group_1', 'Staging', 'Staging approval group', 'workspace_1'),
('production_approval_group_1', 'Production', 'Production approval group', 'workspace_1');

INSERT INTO approval_group_members (approval_group_id, member_id)
VALUES
('dev_approval_group_1', 'developer_1'),
('test_approval_group_1', 'tester_1'),
('uat_approval_group_1', 'uat_1'),
('staging_approval_group_1', 'staging_1'),
('production_approval_group_1', 'production_1');

INSERT INTO environment_types (id, workspace_id, name, description, style)
VALUES
('dev_env_type', 'workspace_1', 'Development', 'Development environments', 'indigo'),
('test_env_type', 'workspace_1', 'Test', 'Testing environment', 'sky'),
('uat_env_type', 'workspace_1', 'UAT', 'User Acceptance environment', 'teal'),
('staging_env_type', 'workspace_1', 'Staging', 'Pre production environment', 'emerald'),
('production_env_type', 'workspace_1', 'Production', 'Production environment', 'green');

INSERT INTO environments (id, workspace_id, type_id, name, description)
VALUES
('dev_1_env', 'workspace_1', 'dev_env_type', 'DEV1', 'Main development environment'),
('dev_2_env', 'workspace_1', 'dev_env_type', 'DEVQA', 'QA development envrionment'),
('test_1_env', 'workspace_1', 'test_env_type', 'TEST1', 'Main test envrionment'),
('test_2_env', 'workspace_1', 'test_env_type', 'TEST2', 'Secondary test envrionment'),
('uat_1_env', 'workspace_1', 'uat_env_type', 'UAT', 'UAT envrionment'),
('staging_env', 'workspace_1', 'staging_env_type', 'STAGING', 'Staging envrionment'),
('production_env', 'workspace_1', 'production_env_type', 'PRODUCTION', 'Production envrionment');

-- SELECT W.slug, E.name, ET.name FROM workspaces W
-- INNER JOIN environments E ON (E.workspace_id = W.id)	
-- INNER JOIN environment_types ET ON (ET.id = E.type_id);

INSERT INTO release_strategies (id, workspace_id, name, description)
VALUES
('rs_default_1', 'workspace_1', 'Default', 'Default release strategy'),
('rs_expedited_2', 'workspace_1', 'Expedited', 'Expedited release strategy');

-- First strategy

INSERT INTO release_strategy_steps (id, release_strategy_id, name, description, action, parent_id, environment_id, approval_group_id)
VALUES
('rss_1', 'rs_default_1', 'Preperation', 'Prepare Release', 'prepare', NULL, NULL, NULL),
('rss_2', 'rs_default_1', 'Deploy to Dev', 'Deploy to Dev', 'deployment', 'rss_1', 'dev_1_env', 'dev_approval_group_1'),
('rss_3', 'rs_default_1', 'Dev Approval', 'Require dev approval', 'approval_gate', 'rss_2', NULL, 'dev_approval_group_1'),
('rss_4', 'rs_default_1', 'Deploy to Dev QA', 'Deploy to Dev QA', 'deployment', 'rss_3', 'dev_2_env', 'test_approval_group_1'),
('rss_5', 'rs_default_1', 'Deploy to Test 1', 'Deploy to test 1', 'deployment', 'rss_4', 'test_1_env', 'test_approval_group_1'),
('rss_6', 'rs_default_1', 'Deploy to Test 2', 'Deploy to test 2', 'deployment', 'rss_4', 'test_2_env', 'test_approval_group_1'),
('rss_7', 'rs_default_1', 'Test Approval', 'Require test approval', 'approval_gate', 'rss_5', NULL, 'test_approval_group_1'),
('rss_8', 'rs_default_1', 'Deploy to UAT', 'Deploy to UAT', 'deployment', 'rss_7', 'uat_1_env', 'uat_approval_group_1'),
('rss_9', 'rs_default_1', 'UAT Approval', 'Require test approval', 'approval_gate', 'rss_8', NULL, 'uat_approval_group_1'),
('rss_10', 'rs_default_1', 'Deploy to Staging', 'Deploy to staging', 'deployment', 'rss_9', 'uat_1_env', 'staging_approval_group_1'),
('rss_11', 'rs_default_1', 'Staging Approval', 'Require staging approval', 'approval_gate', 'rss_10', NULL, 'staging_approval_group_1'),
('rss_12', 'rs_default_1', 'Production Approval', 'Require production approval', 'approval_gate', 'rss_11', NULL, 'staging_approval_group_1'),
('rss_13', 'rs_default_1', 'Deploy to Production', 'Deploy to Production', 'deployment', 'rss_12', 'uat_1_env', 'production_approval_group_1');

SELECT * FROM release_strategy_steps;