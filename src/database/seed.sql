-- Reset data
TRUNCATE workspaces CASCADE;

INSERT INTO workspaces (id, type, slug, clerk_id) 
VALUES ('workspace_1', 'organization', 'testing-workspace', 'org_2bVbNW03wQLl3yjNIOZgV1JIovU');

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
('dev_2_env', 'workspace_1', 'dev_env_type', 'DEVQA', 'QA development environment'),
('test_1_env', 'workspace_1', 'test_env_type', 'TEST1', 'Main test environment'),
('test_2_env', 'workspace_1', 'test_env_type', 'TEST2', 'Secondary test environment'),
('uat_1_env', 'workspace_1', 'uat_env_type', 'UAT', 'UAT environment'),
('staging_env', 'workspace_1', 'staging_env_type', 'STAGING', 'Staging environment'),
('production_env', 'workspace_1', 'production_env_type', 'PRODUCTION', 'Production environment');

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
('rss_1', 'rs_default_1', 'Preparation', 'Prepare Release', 'prepare', NULL, NULL, NULL),
('rss_2', 'rs_default_1', 'Deploy to Dev', 'Deploy to Dev', 'deployment', 'rss_1', 'dev_1_env', 'dev_approval_group_1'),
('rss_3', 'rs_default_1', 'Dev Approval', 'Require dev approval', 'approval_gate', 'rss_2', NULL, 'dev_approval_group_1'),
('rss_4', 'rs_default_1', 'Deploy to Dev QA', 'Deploy to Dev QA', 'deployment', 'rss_3', 'dev_2_env', 'test_approval_group_1'),
('rss_5', 'rs_default_1', 'Deploy to Test 1', 'Deploy to test 1', 'deployment', 'rss_4', 'test_1_env', 'test_approval_group_1'),
('rss_6', 'rs_default_1', 'Deploy to Test 2', 'Deploy to test 2', 'deployment', 'rss_4', 'test_2_env', 'test_approval_group_1'),
('rss_7', 'rs_default_1', 'Test Approval', 'Require test approval', 'approval_gate', 'rss_5', NULL, 'test_approval_group_1'),
('rss_8', 'rs_default_1', 'Deploy to UAT', 'Deploy to UAT', 'deployment', 'rss_7', 'uat_1_env', 'uat_approval_group_1'),
('rss_9', 'rs_default_1', 'UAT Approval', 'Require test approval', 'approval_gate', 'rss_8', NULL, 'uat_approval_group_1'),
('rss_10', 'rs_default_1', 'Deploy to Staging', 'Deploy to staging', 'deployment', 'rss_9', 'staging_env', 'staging_approval_group_1'),
('rss_11', 'rs_default_1', 'Staging Approval', 'Require staging approval', 'approval_gate', 'rss_10', NULL, 'staging_approval_group_1'),
('rss_12', 'rs_default_1', 'Production Approval', 'Require production approval', 'approval_gate', 'rss_11', NULL, 'production_approval_group_1'),
('rss_13', 'rs_default_1', 'Deploy to Production', 'Deploy to Production', 'deployment', 'rss_12', 'production_env', NULL),
('rss_14', 'rs_expedited_2', 'Preparation', 'Prepare Release', 'prepare', NULL, NULL, NULL),
('rss_15', 'rs_expedited_2', 'Test Approval', 'Require test approval', 'approval_gate', 'rss_14', NULL, 'test_approval_group_1'),
('rss_16', 'rs_expedited_2', 'Deploy to Production', 'Deploy to Production', 'deployment', 'rss_15', 'production_env', 'production_approval_group_1');

INSERT INTO components (id, name, description, workspace_id) 
VALUES
('component_public_api', 'Public API', 'Public API Service', 'workspace_1'),
('component_internal_api', 'Internal API', 'Internal API Service', 'workspace_1'),
('component_authentication', 'Authentication ', 'Authentication Service', 'workspace_1'),
('component_marketing_website', 'Marketing Website', 'Marketing Website', 'workspace_1'),
('component_dashboard', 'Dashboard', 'Authenticated Dashboard', 'workspace_1'),
('component_billing_portal', 'Billing Portal', 'Billing Portal Service', 'workspace_1');

INSERT INTO component_versions (id, component_id, version, prepared) 
VALUES
('public_api_v1', 'component_public_api', '1.0.0', true),
('public_api_v2', 'component_public_api', '1.0.1', true),
('public_api_v3', 'component_public_api', '1.0.2', true),
('public_api_v4', 'component_public_api', '1.1.0', true),
('public_api_v5', 'component_public_api', '1.2.0', false),
('internal_api_v1', 'component_internal_api', '0.0.1', true),
('internal_api_v2', 'component_internal_api', '1.0.0', true),
('internal_api_v3', 'component_internal_api', '1.1.0', true),
('authentication_v1', 'component_authentication', '2.74.5', true),
('authentication_v2', 'component_authentication', '3.1.9', true),
('authentication_v3', 'component_authentication', '3.2.0', true),
('marketing_website_v1', 'component_marketing_website', '1.0.0', true),
('marketing_website_v2', 'component_marketing_website', '1.1.0', true),
('marketing_website_v3', 'component_marketing_website', '1.2.0', true),
('marketing_website_v4', 'component_marketing_website', '1.3.0', true),
('marketing_website_v5', 'component_marketing_website', '1.4.0', true),
('marketing_website_v6', 'component_marketing_website', '1.4.1', true),
('marketing_website_v7', 'component_marketing_website', '1.4.2', true),
('marketing_website_v8', 'component_marketing_website', '1.4.3', true),
('marketing_website_v9', 'component_marketing_website', '1.4.4', false),
('dashboard_v1', 'component_dashboard', '0.0.0', true),
('dashboard_v2', 'component_dashboard', '1.0.0', true),
('dashboard_v3', 'component_dashboard', '1.1.0', true),
('billing_v1', 'component_billing_portal', '2023-06-15-184', true),
('billing_v2', 'component_billing_portal', '2024-01-25-304', true);

INSERT INTO releases (id, date, status, version, description, release_strategy_id, workspace_id)
VALUES
('release_1', '2023-08-04', 'complete', '1.0.0', 'Initial release', 'rs_default_1', 'workspace_1'),
('release_2', '2023-09-21', 'complete', '1.1.0', 'Marketing Website tweaks', 'rs_expedited_2', 'workspace_1'),
('release_3', '2023-10-02', 'complete', '1.0.1', 'Marketing Website tweaks', 'rs_expedited_2', 'workspace_1'),
('release_4', '2023-11-17', 'complete', '1.1.0', 'Authentication platform upgrades', 'rs_default_1', 'workspace_1'),
('release_5', '2023-12-13', 'complete', '1.2.0', 'API Upgrades', 'rs_default_1', 'workspace_1'),
('release_6', '2024-01-26', 'complete', '1.3.0', 'Dashboard refresh', 'rs_default_1', 'workspace_1'),
('release_7', '2024-02-13', 'complete', '2.0.0', 'Billing portal refresh', 'rs_default_1', 'workspace_1');

INSERT INTO release_components (release_id, component_version_id, active)
VALUES
('release_1', 'public_api_v1', false),
('release_1', 'public_api_v2', true),
('release_1', 'internal_api_v1', true),
('release_1', 'authentication_v1', true),
('release_1', 'marketing_website_v1', false),
('release_1', 'marketing_website_v2', false),
('release_1', 'marketing_website_v3', true),
('release_1', 'dashboard_v1', true),
('release_1', 'billing_v1', true),
('release_2', 'marketing_website_v4', false),
('release_2', 'marketing_website_v5', false),
('release_2', 'marketing_website_v6', false),
('release_2', 'marketing_website_v7', true),
('release_3', 'marketing_website_v8', false),
('release_3', 'marketing_website_v9', true),
('release_4', 'authentication_v2', true),
('release_5', 'public_api_v3', true),
('release_5', 'internal_api_v2', false),
('release_5', 'internal_api_v3', true),
('release_6', 'dashboard_v2', true),
('release_7', 'dashboard_v3', true),
('release_7', 'billing_v2', true),
('release_7', 'authentication_v3', true),
('release_7', 'public_api_v4', false),
('release_7', 'public_api_v5', true);

INSERT INTO release_steps (id, release_id, release_strategy_step_id, status, finalized_at)
VALUES 
('release_step_1', 'release_1', 'rss_1', 'complete', TIMESTAMP '2023-08-01 09:33:29'),
('release_step_2', 'release_1', 'rss_2', 'complete', TIMESTAMP '2023-08-01 09:50:12'),
('release_step_3', 'release_1', 'rss_3', 'complete', TIMESTAMP '2023-08-01 11:31:34'),
('release_step_4', 'release_1', 'rss_4', 'complete', TIMESTAMP '2023-08-01 11:38:03'),
('release_step_5', 'release_1', 'rss_5', 'complete', TIMESTAMP '2023-08-01 12:01:42'),
('release_step_6', 'release_1', 'rss_6', 'failed', TIMESTAMP '2023-08-01 12:02:03'),
('release_step_7', 'release_1', 'rss_7', 'complete', TIMESTAMP '2023-08-01 15:44:31'),
('release_step_8', 'release_1', 'rss_8', 'complete', TIMESTAMP '2023-08-01 15:56:12'),
('release_step_9', 'release_1', 'rss_9', 'complete', TIMESTAMP '2023-08-02 12:38:18'),
('release_step_10', 'release_1', 'rss_10', 'complete', TIMESTAMP '2023-08-02 13:01:38'),
('release_step_11', 'release_1', 'rss_11', 'complete', TIMESTAMP '2023-08-02 13:52:38'),
('release_step_12', 'release_1', 'rss_12', 'complete', TIMESTAMP '2023-08-04 10:18:53'),
('release_step_13', 'release_1', 'rss_13', 'complete', TIMESTAMP '2023-08-04 10:26:13'),
('release_step_14', 'release_2', 'rss_14', 'complete', TIMESTAMP '2023-09-21 11:10:09'),
('release_step_15', 'release_2', 'rss_15', 'complete', TIMESTAMP '2023-09-21 13:38:39'),
('release_step_16', 'release_2', 'rss_16', 'complete', TIMESTAMP '2023-09-21 14:25:21'),
('release_step_17', 'release_3', 'rss_14', 'complete', TIMESTAMP '2023-10-02 09:01:06'),
('release_step_18', 'release_3', 'rss_15', 'complete', TIMESTAMP '2023-10-02 14:53:51'),
('release_step_19', 'release_3', 'rss_16', 'complete', TIMESTAMP '2023-09-02 15:08:06'),
('release_step_20', 'release_4', 'rss_1', 'complete', TIMESTAMP '2023-11-05 09:33:29'),
('release_step_21', 'release_4', 'rss_2', 'complete', TIMESTAMP '2023-11-06 09:50:12'),
('release_step_22', 'release_4', 'rss_3', 'complete', TIMESTAMP '2023-11-07 11:31:34'),
('release_step_23', 'release_4', 'rss_4', 'complete', TIMESTAMP '2023-11-08 11:38:03'),
('release_step_24', 'release_4', 'rss_5', 'complete', TIMESTAMP '2023-11-09 12:01:42'),
('release_step_25', 'release_4', 'rss_6', 'failed', TIMESTAMP '2023-11-10 12:02:03'),
('release_step_26', 'release_4', 'rss_7', 'complete', TIMESTAMP '2023-11-13 15:44:31'),
('release_step_27', 'release_4', 'rss_8', 'complete', TIMESTAMP '2023-11-14 15:56:12'),
('release_step_28', 'release_4', 'rss_9', 'complete', TIMESTAMP '2023-11-15 12:38:18'),
('release_step_29', 'release_4', 'rss_10', 'complete', TIMESTAMP '2023-11-16 13:01:38'),
('release_step_30', 'release_4', 'rss_11', 'complete', TIMESTAMP '2023-11-17 13:52:38'),
('release_step_31', 'release_4', 'rss_12', 'complete', TIMESTAMP '2023-11-17 10:18:53'),
('release_step_32', 'release_4', 'rss_13', 'complete', TIMESTAMP '2023-11-17 10:26:13'),
('release_step_33', 'release_5', 'rss_1', 'pending', TIMESTAMP '2023-12-01 09:00:00'),
('release_step_34', 'release_5', 'rss_2', 'pending', TIMESTAMP '2023-12-02 09:15:00'),
('release_step_35', 'release_5', 'rss_3', 'pending', TIMESTAMP '2023-12-03 10:30:00'),
('release_step_36', 'release_5', 'rss_4', 'pending', TIMESTAMP '2023-12-04 10:45:00'),
('release_step_37', 'release_5', 'rss_5', 'pending', TIMESTAMP '2023-12-05 11:00:00'),
('release_step_38', 'release_5', 'rss_6', 'pending', TIMESTAMP '2023-12-06 11:15:00'),
('release_step_39', 'release_5', 'rss_7', 'pending', TIMESTAMP '2023-12-07 11:30:00'),
('release_step_40', 'release_5', 'rss_8', 'pending', TIMESTAMP '2023-12-08 11:45:00'),
('release_step_41', 'release_5', 'rss_9', 'pending', TIMESTAMP '2023-12-09 12:00:00'),
('release_step_42', 'release_5', 'rss_10', 'pending', TIMESTAMP '2023-12-10 12:15:00'),
('release_step_43', 'release_5', 'rss_11', 'pending', TIMESTAMP '2023-12-11 12:30:00'),
('release_step_44', 'release_5', 'rss_12', 'pending', TIMESTAMP '2023-12-12 12:45:00'),
('release_step_45', 'release_5', 'rss_13', 'pending', TIMESTAMP '2023-12-13 13:00:00'),
('release_step_46', 'release_6', 'rss_1', 'pending', TIMESTAMP '2024-01-14 14:15:00'),
('release_step_47', 'release_6', 'rss_2', 'pending', TIMESTAMP '2024-01-15 14:30:00'),
('release_step_48', 'release_6', 'rss_3', 'pending', TIMESTAMP '2024-01-16 14:45:00'),
('release_step_49', 'release_6', 'rss_4', 'pending', TIMESTAMP '2024-01-17 15:00:00'),
('release_step_50', 'release_6', 'rss_5', 'pending', TIMESTAMP '2024-01-18 15:15:00'),
('release_step_51', 'release_6', 'rss_6', 'pending', TIMESTAMP '2024-01-19 15:30:00'),
('release_step_52', 'release_6', 'rss_7', 'pending', TIMESTAMP '2024-01-20 15:45:00'),
('release_step_53', 'release_6', 'rss_8', 'pending', TIMESTAMP '2024-01-21 16:00:00'),
('release_step_54', 'release_6', 'rss_9', 'pending', TIMESTAMP '2024-01-22 16:15:00'),
('release_step_55', 'release_6', 'rss_10', 'pending', TIMESTAMP '2024-01-23 16:30:00'),
('release_step_56', 'release_6', 'rss_11', 'pending', TIMESTAMP '2024-01-24 16:45:00'),
('release_step_57', 'release_6', 'rss_12', 'pending', TIMESTAMP '2024-01-25 17:00:00'),
('release_step_58', 'release_6', 'rss_13', 'pending', TIMESTAMP '2024-01-26 17:15:00'),
('release_step_59', 'release_7', 'rss_1', 'pending', TIMESTAMP '2024-02-01 09:00:00'),
('release_step_60', 'release_7', 'rss_2', 'pending', TIMESTAMP '2024-02-02 09:15:00'),
('release_step_61', 'release_7', 'rss_3', 'pending', TIMESTAMP '2024-02-03 10:30:00'),
('release_step_62', 'release_7', 'rss_4', 'pending', TIMESTAMP '2024-02-04 10:45:00'),
('release_step_63', 'release_7', 'rss_5', 'pending', TIMESTAMP '2024-02-05 11:00:00'),
('release_step_64', 'release_7', 'rss_6', 'pending', TIMESTAMP '2024-02-06 11:15:00'),
('release_step_65', 'release_7', 'rss_7', 'pending', TIMESTAMP '2024-02-07 11:30:00'),
('release_step_66', 'release_7', 'rss_8', 'pending', TIMESTAMP '2024-02-08 11:45:00'),
('release_step_67', 'release_7', 'rss_9', 'pending', TIMESTAMP '2024-02-09 12:00:00'),
('release_step_68', 'release_7', 'rss_10', 'pending', TIMESTAMP '2024-02-10 12:15:00'),
('release_step_69', 'release_7', 'rss_11', 'pending', TIMESTAMP '2024-02-11 12:30:00'),
('release_step_70', 'release_7', 'rss_12', 'pending', TIMESTAMP '2024-02-12 12:45:00'),
('release_step_71', 'release_7', 'rss_13', 'pending', TIMESTAMP '2024-02-13 13:00:00');

INSERT INTO deployments (id, release_step_id, environment_id, status)
VALUES
('dep_1', 'release_step_2', 'dev_1_env', 'complete'),
('dep_2', 'release_step_4', 'dev_2_env', 'complete'),
('dep_3', 'release_step_5', 'test_1_env', 'complete'),
('dep_4', 'release_step_6', 'test_2_env', 'failed'),
('dep_5', 'release_step_6', 'test_2_env', 'failed'),
('dep_6', 'release_step_8', 'uat_1_env', 'complete'),
('dep_7', 'release_step_10', 'staging_env', 'complete'),
('dep_8', 'release_step_13', 'production_env', 'complete'),
('dep_9', 'release_step_16', 'production_env', 'complete'),
('dep_10', 'release_step_19', 'production_env', 'complete'),
('dep_11', 'release_step_21', 'dev_1_env', 'complete'),
('dep_12', 'release_step_23', 'dev_2_env', 'complete'),
('dep_13', 'release_step_24', 'test_1_env', 'complete'),
('dep_14', 'release_step_25', 'test_2_env', 'failed'),
('dep_15', 'release_step_25', 'test_2_env', 'failed'),
('dep_16', 'release_step_27', 'uat_1_env', 'complete'),
('dep_17', 'release_step_29', 'staging_env', 'complete'),
('dep_18', 'release_step_32', 'production_env', 'complete'),
('dep_19', 'release_step_34', 'dev_1_env', 'complete'),
('dep_20', 'release_step_36', 'dev_2_env', 'complete'),
('dep_21', 'release_step_37', 'test_1_env', 'complete'),
('dep_22', 'release_step_38', 'test_2_env', 'failed'),
('dep_23', 'release_step_38', 'test_2_env', 'failed'),
('dep_24', 'release_step_40', 'uat_1_env', 'complete'),
('dep_25', 'release_step_42', 'staging_env', 'complete'),
('dep_26', 'release_step_45', 'production_env', 'complete'),
('dep_27', 'release_step_47', 'dev_1_env', 'complete'),
('dep_28', 'release_step_49', 'dev_2_env', 'complete'),
('dep_29', 'release_step_50', 'test_1_env', 'complete'),
('dep_30', 'release_step_51', 'test_2_env', 'failed'),
('dep_31', 'release_step_51', 'test_2_env', 'failed'),
('dep_32', 'release_step_53', 'uat_1_env', 'complete'),
('dep_33', 'release_step_55', 'staging_env', 'complete'),
('dep_34', 'release_step_58', 'production_env', 'complete'),
('dep_35', 'release_step_60', 'dev_1_env', 'complete'),
('dep_36', 'release_step_62', 'dev_2_env', 'complete'),
('dep_37', 'release_step_63', 'test_1_env', 'complete'),
('dep_38', 'release_step_64', 'test_2_env', 'failed'),
('dep_39', 'release_step_64', 'test_2_env', 'failed'),
('dep_40', 'release_step_66', 'uat_1_env', 'complete'),
('dep_41', 'release_step_68', 'staging_env', 'complete'),
('dep_42', 'release_step_71', 'production_env', 'complete');

INSERT INTO approvals (id, release_step_id, type, approved, comments, member_id)
VALUES
('approval_1', 'release_step_2', 'post_deployment', true, 'Deploy to Dev approved', 'developer_1'),
('approval_2', 'release_step_3', 'approval_gate', true, 'Dev Approval passed', 'developer_1'),
('approval_3', 'release_step_4', 'post_deployment', true, 'Deploy to Dev QA approved', 'tester_1'),
('approval_4', 'release_step_5', 'post_deployment', true, 'Deploy to Test 1 approved', 'tester_1'),
('approval_5', 'release_step_6', 'post_deployment', true, 'Deploy to Test 2 approved', 'tester_1'),
('approval_6', 'release_step_7', 'approval_gate', true, 'Test Approval passed', 'tester_1'),
('approval_7', 'release_step_8', 'post_deployment', true, 'Deploy to UAT approved', 'uat_1'),
('approval_8', 'release_step_9', 'approval_gate', true, 'UAT Approval passed', 'uat_1'),
('approval_9', 'release_step_10', 'post_deployment', true, 'Deploy to Staging approved', 'staging_1'),
('approval_10', 'release_step_11', 'approval_gate', true, 'Staging Approval passed', 'staging_1'),
('approval_11', 'release_step_12', 'approval_gate', true, 'Production Approval passed', 'production_1'),
('approval_12', 'release_step_15', 'approval_gate', true, 'Test Approval (Expedited) passed', 'tester_1'),
('approval_13', 'release_step_16', 'post_deployment', true, 'Deploy to Production (Expedited) approved', 'production_1'),
('approval_14', 'release_step_18', 'approval_gate', true, 'Test Approval (Expedited) passed', 'tester_1'),
('approval_15', 'release_step_19', 'post_deployment', true, 'Deploy to Production (Expedited) approved', 'production_1'),
('approval_16', 'release_step_21', 'post_deployment', true, 'Deploy to Dev approved', 'developer_1'),
('approval_17', 'release_step_22', 'approval_gate', true, 'Dev Approval passed', 'developer_1'),
('approval_18', 'release_step_23', 'post_deployment', true, 'Deploy to Dev QA approved', 'tester_1'),
('approval_19', 'release_step_24', 'post_deployment', true, 'Deploy to Test 1 approved', 'tester_1'),
('approval_20', 'release_step_25', 'post_deployment', true, 'Deploy to Test 2 approved', 'tester_1'),
('approval_21', 'release_step_26', 'approval_gate', true, 'Test Approval passed', 'tester_1'),
('approval_22', 'release_step_27', 'post_deployment', true, 'Deploy to UAT approved', 'uat_1'),
('approval_23', 'release_step_28', 'approval_gate', true, 'UAT Approval passed', 'uat_1'),
('approval_24', 'release_step_29', 'post_deployment', true, 'Deploy to Staging approved', 'staging_1'),
('approval_25', 'release_step_30', 'approval_gate', true, 'Staging Approval passed', 'staging_1'),
('approval_26', 'release_step_31', 'approval_gate', true, 'Production Approval passed', 'production_1'),
('approval_27', 'release_step_34', 'post_deployment', true, 'Deploy to Dev approved', 'developer_1'),
('approval_28', 'release_step_35', 'approval_gate', true, 'Dev Approval passed', 'developer_1'),
('approval_29', 'release_step_36', 'post_deployment', true, 'Deploy to Dev QA approved', 'tester_1'),
('approval_30', 'release_step_37', 'post_deployment', true, 'Deploy to Test 1 approved', 'tester_1'),
('approval_31', 'release_step_38', 'post_deployment', true, 'Deploy to Test 2 approved', 'tester_1'),
('approval_32', 'release_step_39', 'approval_gate', true, 'Test Approval passed', 'tester_1'),
('approval_33', 'release_step_40', 'post_deployment', true, 'Deploy to UAT approved', 'uat_1'),
('approval_34', 'release_step_41', 'approval_gate', true, 'UAT Approval passed', 'uat_1'),
('approval_35', 'release_step_42', 'post_deployment', true, 'Deploy to Staging approved', 'staging_1'),
('approval_36', 'release_step_43', 'approval_gate', true, 'Staging Approval passed', 'staging_1'),
('approval_37', 'release_step_44', 'approval_gate', true, 'Production Approval passed', 'production_1'),
('approval_38', 'release_step_47', 'post_deployment', true, 'Deploy to Dev approved', 'developer_1'),
('approval_39', 'release_step_48', 'approval_gate', true, 'Dev Approval passed', 'developer_1'),
('approval_40', 'release_step_49', 'post_deployment', true, 'Deploy to Dev QA approved', 'tester_1'),
('approval_41', 'release_step_50', 'post_deployment', true, 'Deploy to Test 1 approved', 'tester_1'),
('approval_42', 'release_step_51', 'post_deployment', true, 'Deploy to Test 2 approved', 'tester_1'),
('approval_43', 'release_step_52', 'approval_gate', true, 'Test Approval passed', 'tester_1'),
('approval_44', 'release_step_53', 'post_deployment', true, 'Deploy to UAT approved', 'uat_1'),
('approval_45', 'release_step_54', 'approval_gate', true, 'UAT Approval passed', 'uat_1'),
('approval_46', 'release_step_55', 'post_deployment', true, 'Deploy to Staging approved', 'staging_1'),
('approval_47', 'release_step_56', 'approval_gate', true, 'Staging Approval passed', 'staging_1'),
('approval_48', 'release_step_57', 'approval_gate', true, 'Production Approval passed', 'production_1'),
('approval_49', 'release_step_60', 'post_deployment', true, 'Deploy to Dev approved', 'developer_1'),
('approval_50', 'release_step_61', 'approval_gate', true, 'Dev Approval passed', 'developer_1'),
('approval_51', 'release_step_62', 'post_deployment', true, 'Deploy to Dev QA approved', 'tester_1'),
('approval_52', 'release_step_63', 'post_deployment', true, 'Deploy to Test 1 approved', 'tester_1'),
('approval_53', 'release_step_64', 'post_deployment', true, 'Deploy to Test 2 approved', 'tester_1'),
('approval_54', 'release_step_65', 'approval_gate', true, 'Test Approval passed', 'tester_1'),
('approval_55', 'release_step_66', 'post_deployment', true, 'Deploy to UAT approved', 'uat_1'),
('approval_56', 'release_step_67', 'approval_gate', true, 'UAT Approval passed', 'uat_1'),
('approval_57', 'release_step_68', 'post_deployment', true, 'Deploy to Staging approved', 'staging_1'),
('approval_58', 'release_step_69', 'approval_gate', true, 'Staging Approval passed', 'staging_1'),
('approval_59', 'release_step_70', 'approval_gate', true, 'Production Approval passed', 'production_1');

-- SELECT * FROM release_steps STEPS 
-- INNER JOIN deployments D ON (D.release_step_id = STEPS.id);

WITH RECURSIVE release_strategy_steps_hierarchy AS (
  SELECT id, name, release_strategy_id, action, parent_id, 1 AS order
  FROM release_strategy_steps
  WHERE parent_id IS NULL
  UNION ALL
  SELECT RSS.id, RSS.name, RSS.release_strategy_id, RSS.action, RSS.parent_id, RSSH.order + 1
  FROM release_strategy_steps RSS
  JOIN release_strategy_steps_hierarchy RSSH ON RSS.parent_id = RSSH.id
)
SELECT R.id as release_id, RSSH.id as release_strategy_step_id, STEPS.id as release_step_id, RSSH.action, A.approved, A.type as approval_type, M.clerk_id as approval_member, RSSH.name, D.environment_id, E.name, D.status as deployment_status, RSSH.release_strategy_id, RSSH.parent_id, RSSH.order, STEPS.status as release_step_status, STEPS.finalized_at as release_step_finalized_at
FROM release_strategy_steps_hierarchy RSSH
INNER JOIN release_strategies RS ON (RS.id = RSSH.release_strategy_id)
INNER JOIN releases R ON (R.release_strategy_id = RS.id)
LEFT OUTER JOIN release_steps STEPS on (STEPS.release_strategy_step_id = RSSH.id AND R.id = STEPS.release_id)
LEFT OUTER JOIN deployments D ON (STEPS.id = D.release_step_id)
LEFT OUTER JOIN environments E ON (D.environment_id = E.id)
LEFT OUTER JOIN approvals A ON (A.release_step_id = STEPS.id)
LEFT OUTER JOIN members M ON (M.id = A.member_id)
WHERE R.id = 'release_4'
ORDER BY RSSH.release_strategy_id, RSSH.order;

-- SELECT RS.id as release_step_id, RSS.id as release_strategy_step_id, RSS.name as release_strategy_step_name, RSS.action, RSS.approval_group_id, RSS.release_strategy_id
-- FROM release_strategy_steps RSS
-- LEFT OUTER JOIN release_steps RS on (RS.release_strategy_step_id = RSS.id)
-- WHERE RSS.approval_group_id IS NOT NULL;

