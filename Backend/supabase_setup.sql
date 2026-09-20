-- CredLayer Database Setup SQL

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create API Keys Table (most important for developer dashboard)
CREATE TABLE IF NOT EXISTS api_keys (
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

-- Create indexes for api_keys
CREATE INDEX IF NOT EXISTS ix_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS ix_owner_wallet_api_keys ON api_keys(owner_wallet);

-- Create Webhooks Table
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_wallet VARCHAR(64) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    secret VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_owner_wallet_webhooks ON webhooks(owner_wallet);

-- Create Request Logs Table
CREATE TABLE IF NOT EXISTS request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(256) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_api_key_id_logs ON request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS ix_created_at_logs ON request_logs(created_at DESC);

-- Create Credentials Table (for attestations/credentials)
CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holder_wallet VARCHAR(64) NOT NULL,
    issuer_wallet VARCHAR(64) NOT NULL,
    schema_id VARCHAR(128) NOT NULL,
    attestation_id VARCHAR(128) UNIQUE,
    credential_data JSONB NOT NULL,
    metadata JSONB,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_holder_wallet_creds ON credentials(holder_wallet);
CREATE INDEX IF NOT EXISTS ix_issuer_wallet_creds ON credentials(issuer_wallet);
CREATE INDEX IF NOT EXISTS ix_attestation_id_creds ON credentials(attestation_id);
CREATE INDEX IF NOT EXISTS ix_status_creds ON credentials(status);

-- Create Connections Table (social/trust connections)
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_wallet VARCHAR(64) NOT NULL,
    to_wallet VARCHAR(64) NOT NULL,
    connection_type VARCHAR(32) NOT NULL,
    strength DECIMAL(3,2) DEFAULT 0.5,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(from_wallet, to_wallet, connection_type)
);

CREATE INDEX IF NOT EXISTS ix_from_wallet_conn ON connections(from_wallet);
CREATE INDEX IF NOT EXISTS ix_to_wallet_conn ON connections(to_wallet);
CREATE INDEX IF NOT EXISTS ix_connection_type ON connections(connection_type);

-- Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL UNIQUE,
    agent_type VARCHAR(32) NOT NULL,
    name VARCHAR(256),
    description TEXT,
    capabilities JSONB,
    metadata JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_wallet_address_agents ON agents(wallet_address);
CREATE INDEX IF NOT EXISTS ix_agent_type ON agents(agent_type);
CREATE INDEX IF NOT EXISTS ix_is_active_agents ON agents(is_active);

-- Create Activity Table (for audit logs)
CREATE TABLE IF NOT EXISTS activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL,
    activity_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(32),
    entity_id UUID,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_wallet_address_activity ON activity(wallet_address);
CREATE INDEX IF NOT EXISTS ix_activity_type ON activity(activity_type);
CREATE INDEX IF NOT EXISTS ix_created_at_activity ON activity(created_at DESC);

-- Create Settings Table (user preferences)
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(64) NOT NULL UNIQUE,
    preferences JSONB NOT NULL DEFAULT '{}',
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_wallet_address_settings ON settings(wallet_address);

-- Create Alembic version table (for tracking migrations)
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

-- Insert current migration version
INSERT INTO alembic_version (version_num) VALUES ('007_webhooks_logs')
ON CONFLICT (version_num) DO NOTHING;

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
