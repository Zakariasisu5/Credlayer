-- CredLayer Database Setup SQL
-- Run this in Supabase SQL Editor to create all tables with the correct schema
-- This matches the Alembic migrations in Backend/migrations/versions/

-- =============================================================================
-- ⚠️  OPTION 1: RESET DATABASE (if tables already exist with wrong schema)
-- =============================================================================
-- Uncomment these lines to drop everything and start fresh:
/*
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
*/

-- =============================================================================
-- Extensions
-- =============================================================================
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 001: Credentials Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL,
    credential_type VARCHAR(64) NOT NULL,
    credential_value TEXT NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_wallet_address ON credentials(wallet_address);
CREATE INDEX IF NOT EXISTS ix_verification_status ON credentials(verification_status);

-- =============================================================================
-- 002: Connections Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_wallet VARCHAR(64) NOT NULL,
    to_wallet VARCHAR(64) NOT NULL,
    connection_type VARCHAR(32) NOT NULL,
    trust_weight FLOAT NOT NULL DEFAULT 0.5,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_from_wallet ON connections(from_wallet);
CREATE INDEX IF NOT EXISTS ix_to_wallet ON connections(to_wallet);
CREATE UNIQUE INDEX IF NOT EXISTS ix_connection_pair ON connections(from_wallet, to_wallet);

-- =============================================================================
-- 003: Agents Tables
-- =============================================================================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(128) NOT NULL UNIQUE,
    owner_wallet VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    description TEXT,
    permissions JSONB,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    agent_metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_agent_id ON agents(agent_id);
CREATE INDEX IF NOT EXISTS ix_owner_wallet_agents ON agents(owner_wallet);

CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    execution_type VARCHAR(64) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ix_agent_id_exec ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS ix_started_at_exec ON agent_executions(started_at);

-- =============================================================================
-- 004: Activity Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    event_category VARCHAR(32) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    status VARCHAR(32) NOT NULL,
    metadata JSONB,
    error_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_wallet_address_activity ON activity(wallet_address);
CREATE INDEX IF NOT EXISTS ix_event_type ON activity(event_type);
CREATE INDEX IF NOT EXISTS ix_created_at_activity ON activity(created_at);

-- =============================================================================
-- 005: Settings Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL UNIQUE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    theme VARCHAR(32) NOT NULL DEFAULT 'light',
    language VARCHAR(16) NOT NULL DEFAULT 'en',
    settings_metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_wallet_address_settings ON settings(wallet_address);

-- =============================================================================
-- 006: API Keys Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_wallet VARCHAR(64) NOT NULL,
    key_hash VARCHAR(128) NOT NULL UNIQUE,
    key_prefix VARCHAR(16) NOT NULL,
    name VARCHAR(256) NOT NULL,
    permissions JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS ix_owner_wallet_api_keys ON api_keys(owner_wallet);

-- =============================================================================
-- 007: Webhooks and Request Logs Tables
-- =============================================================================
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_wallet VARCHAR(64) NOT NULL,
    url VARCHAR(512) NOT NULL,
    event_types TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    secret VARCHAR(128),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_owner_wallet_webhooks ON webhooks(owner_wallet);

CREATE TABLE IF NOT EXISTS request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID,
    owner_wallet VARCHAR(64) NOT NULL,
    method VARCHAR(16) NOT NULL,
    endpoint VARCHAR(512) NOT NULL,
    status_code INTEGER NOT NULL,
    request_headers JSONB,
    request_body JSONB,
    response_body JSONB,
    error_message TEXT,
    duration_ms INTEGER,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_api_key_id_logs ON request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS ix_owner_wallet_logs ON request_logs(owner_wallet);
CREATE INDEX IF NOT EXISTS ix_created_at_logs ON request_logs(created_at);

-- =============================================================================
-- Alembic Version Tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

-- Set the current migration version
INSERT INTO alembic_version (version_num) VALUES ('007_webhooks_logs')
ON CONFLICT (version_num) DO NOTHING;

-- =============================================================================
-- Success Message
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '✅ CredLayer database setup complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables created:';
    RAISE NOTICE '  - credentials (wallet attestations and verifications)';
    RAISE NOTICE '  - connections (trust graph connections)';
    RAISE NOTICE '  - agents (AI agents)';
    RAISE NOTICE '  - agent_executions (agent run history)';
    RAISE NOTICE '  - activity (event audit log)';
    RAISE NOTICE '  - settings (user preferences)';
    RAISE NOTICE '  - api_keys (developer API keys)';
    RAISE NOTICE '  - webhooks (webhook subscriptions)';
    RAISE NOTICE '  - request_logs (API request logs)';
    RAISE NOTICE '  - alembic_version (migration tracking)';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 All tables match migration version: 007_webhooks_logs';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next steps:';
    RAISE NOTICE '1. Verify in Supabase Table Editor that all tables exist';
    RAISE NOTICE '2. Redeploy your Railway backend service';
    RAISE NOTICE '3. Check Railway logs for "Migrations completed successfully"';
    RAISE NOTICE '4. Test API: curl https://your-app.railway.app/readyz';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Important column names to verify:';
    RAISE NOTICE '  - credentials.wallet_address (NOT holder_wallet)';
    RAISE NOTICE '  - activity.event_type (NOT activity_type)';
    RAISE NOTICE '  - agents.agent_id (NOT wallet_address as primary identifier)';
    RAISE NOTICE '  - request_logs.owner_wallet (NOT api_key_id only)';
END $$;

-- Grant permissions (optional, adjust based on your RLS policies)
-- ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ CredLayer database setup complete!';
    RAISE NOTICE '📊 Tables created: api_keys, webhooks, request_logs, credentials, connections, agents, activity, settings';
    RAISE NOTICE '🔐 Project ID: mgwoicaatrqzvawgydrm';
    RAISE NOTICE '🌍 Region: eu-west-1';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next steps:';
    RAISE NOTICE '1. Start your backend: cd Backend && uv run uvicorn credlayer.main:app --port 8000 --reload';
    RAISE NOTICE '2. Start your frontend: cd Frontend && npm run dev';
    RAISE NOTICE '3. Visit: http://localhost:3000';
END $$;
