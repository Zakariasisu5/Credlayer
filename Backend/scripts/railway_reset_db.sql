-- Railway Database Reset Script
-- USE WITH CAUTION: This drops all tables and data
--
-- To use:
-- 1. Go to Railway → Your Postgres service → Data → Query
-- 2. Copy and paste this entire script
-- 3. Click "Run"
-- 4. Redeploy your backend service
--
-- The backend will automatically recreate all tables with the correct schema

-- Drop everything in the public schema
DROP SCHEMA IF EXISTS public CASCADE;

-- Recreate the public schema
CREATE SCHEMA public;

-- Restore default permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Confirm success
SELECT 'Database reset complete. Redeploy your backend to recreate tables.' AS status;
