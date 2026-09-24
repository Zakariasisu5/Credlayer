#!/usr/bin/env python3
"""
Check database migration status and schema.

Run this to diagnose migration issues on Railway or other deployments.
"""
import asyncio
import sys

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from credlayer.core.config import get_settings


async def check_migrations():
    """Check if migrations have been applied."""
    settings = get_settings()
    engine = create_async_engine(settings.database_url)
    
    print(f"Connecting to database: {settings.database_url.split('@')[1] if '@' in settings.database_url else 'localhost'}")
    
    try:
        async with engine.connect() as conn:
            # Check if alembic_version table exists
            result = await conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'alembic_version'
                );
            """))
            alembic_exists = result.scalar()
            
            if not alembic_exists:
                print("❌ alembic_version table does not exist")
                print("   → Migrations have never been run")
                return False
            
            print("✅ alembic_version table exists")
            
            # Get current migration version
            result = await conn.execute(text("SELECT version_num FROM alembic_version;"))
            version = result.scalar()
            
            if version:
                print(f"✅ Current migration version: {version}")
            else:
                print("⚠️  No migration version recorded")
                return False
            
            # Check if credentials table exists
            result = await conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'credentials'
                );
            """))
            credentials_exists = result.scalar()
            
            if not credentials_exists:
                print("❌ credentials table does not exist")
                return False
            
            print("✅ credentials table exists")
            
            # Check credentials table columns
            result = await conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'credentials'
                ORDER BY ordinal_position;
            """))
            columns = result.fetchall()
            
            print("\n📋 Credentials table columns:")
            for col_name, col_type in columns:
                print(f"   - {col_name}: {col_type}")
            
            expected_columns = {
                'id', 'wallet_address', 'credential_type', 'credential_value',
                'verification_status', 'verified_at', 'expires_at', 'metadata',
                'created_at', 'updated_at'
            }
            actual_columns = {col[0] for col in columns}
            
            missing = expected_columns - actual_columns
            if missing:
                print(f"\n❌ Missing columns: {', '.join(missing)}")
                return False
            
            print("\n✅ All expected columns present")
            
            # Check other tables
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """))
            tables = [row[0] for row in result.fetchall()]
            
            print(f"\n📋 Database tables ({len(tables)}):")
            for table in tables:
                print(f"   - {table}")
            
            expected_tables = {
                'credentials', 'connections', 'agents', 'agent_executions',
                'activity', 'settings', 'api_keys', 'webhooks', 'request_logs',
                'alembic_version'
            }
            
            missing_tables = expected_tables - set(tables)
            if missing_tables:
                print(f"\n⚠️  Missing tables: {', '.join(missing_tables)}")
                print("   → These tables should be created by migrations")
            
            return len(missing) == 0
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        await engine.dispose()


if __name__ == "__main__":
    success = asyncio.run(check_migrations())
    sys.exit(0 if success else 1)
