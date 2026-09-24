-- Verify all expected tables and columns exist
-- Run this directly in Railway's Postgres query console to check schema

-- Check alembic version
SELECT 'Migration Version:' as check_type, version_num as value 
FROM alembic_version
UNION ALL

-- Count all tables
SELECT 'Total Tables:' as check_type, COUNT(*)::text as value
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
UNION ALL

-- List all tables
SELECT 'Tables:' as check_type, string_agg(table_name, ', ' ORDER BY table_name) as value
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check credentials table columns
SELECT 'credentials columns:' as info, 
       string_agg(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_name = 'credentials'
UNION ALL

-- Check activity table columns  
SELECT 'activity columns:' as info,
       string_agg(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'activity'
UNION ALL

-- Check request_logs table columns
SELECT 'request_logs columns:' as info,
       string_agg(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_name = 'request_logs';

-- Expected results:
-- credentials: id, wallet_address, credential_type, credential_value, verification_status, verified_at, expires_at, metadata, created_at, updated_at
-- activity: id, wallet_address, event_type, event_category, title, description, status, metadata, error_details, created_at
-- request_logs: id, api_key_id, owner_wallet, method, endpoint, status_code, request_headers, request_body, response_body, error_message, duration_ms, ip_address, created_at
