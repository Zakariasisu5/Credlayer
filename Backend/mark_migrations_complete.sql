-- Mark all migrations as complete in Supabase
-- Run this in Supabase SQL Editor to fix the migration conflict

-- Update the alembic version to the latest migration
UPDATE alembic_version SET version_num = '007_webhooks_logs';

-- If the table doesn't exist, create it
INSERT INTO alembic_version (version_num) 
VALUES ('007_webhooks_logs')
ON CONFLICT DO NOTHING;
