CREATE SCHEMA IF NOT EXISTS neon_control_plane;
CREATE TABLE IF NOT EXISTS neon_control_plane.endpoints (endpoint_id VARCHAR(255) PRIMARY KEY, allowed_ips VARCHAR(255));
