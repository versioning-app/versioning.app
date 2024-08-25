DO $$ BEGIN
 CREATE TYPE "public"."permission_scopes" AS ENUM('workspace', 'self');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
