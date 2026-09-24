-- =============================================================================
-- CredLayer Database Setup — verified against actual route/model source
-- Run this in Supabase SQL Editor
-- =============================================================================

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- credentials.py -> CredentialDB
-- =============================================================================
CREATE TABLE credentials (
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
CREATE INDEX ix_credentials_wallet_address ON credentials(wallet_address);

-- =============================================================================
-- connections.py -> ConnectionDB
-- =============================================================================
CREATE TABLE connections (
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
CREATE INDEX ix_connections_from_wallet ON connections(from_wallet);
CREATE INDEX ix_connections_to_wallet ON connections(to_wallet);

-- =============================================================================
-- agents.py -> AgentDB, AgentActivityDB
-- =============================================================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(128) NOT NULL UNIQUE,
    owner_wallet VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    agent_metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_agents_agent_id ON agents(agent_id);
CREATE INDEX ix_agents_owner_wallet ON agents(owner_wallet);

CREATE TABLE agent_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(128) NOT NULL,
    activity_type VARCHAR(64) NOT NULL,
    endpoint VARCHAR(256) NOT NULL,
    method VARCHAR(16) NOT NULL,
    status_code INTEGER NOT NULL,
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_agent_activity_agent_id ON agent_activity(agent_id);

-- =============================================================================
-- activity.py -> ActivityDB
-- =============================================================================
CREATE TABLE activity (
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
CREATE INDEX ix_activity_wallet_address ON activity(wallet_address);

-- =============================================================================
-- settings.py -> SettingsDB
-- =============================================================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL UNIQUE,
    preferences JSONB NOT NULL,
    notifications JSONB NOT NULL,
    privacy JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_settings_wallet_address ON settings(wallet_address);

-- =============================================================================
-- api_keys.py -> ApiKeyDB  (note: model has NO updated_at column)
-- =============================================================================
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash VARCHAR(128) NOT NULL UNIQUE,
    key_prefix VARCHAR(16) NOT NULL,
    owner_wallet VARCHAR(64) NOT NULL,
    name VARCHAR(256) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    permissions JSONB,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
);
CREATE INDEX ix_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX ix_api_keys_owner_wallet ON api_keys(owner_wallet);

DO $$
BEGIN
    RAISE NOTICE '✅ CredLayer schema created from verified route models.';
END $$;