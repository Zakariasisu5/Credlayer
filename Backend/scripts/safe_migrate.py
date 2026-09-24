#!/usr/bin/env python3
"""
Safe migration script that handles existing schemas.

This script:
1. Checks if alembic_version exists
2. If not, stamps the database at the current revision
3. Runs migrations
"""
import asyncio
import subprocess
import sys

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from credlayer.core.config import get_settings


async def safe_migrate():
    """Safely apply migrations, handling existing schemas."""
    settings = get_settings()
    engine = create_async_engine(settings.database_url)
    
    print("🔍 Checking database state...")
    
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
                print("⚠️  No alembic_version table found")
                
                # Check if any of our tables exist
                result = await conn.execute(text("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name IN ('credentials', 'connections', 'activity')
                    );
                """))
                tables_exist = result.scalar()
                
                if tables_exist:
                    print("⚠️  Existing tables found without migration tracking")
                    print("   This suggests the database was created manually")
                    print("   or migrations were not tracked")
                    print("")
                    print("🔧 Stamping database at head revision...")
                    
                    # Stamp the database at the latest revision without running migrations
                    result = subprocess.run(
                        ["alembic", "stamp", "head"],
                        capture_output=True,
                        text=True
                    )
                    
                    if result.returncode != 0:
                        print(f"❌ Failed to stamp database: {result.stderr}")
                        return False
                    
                    print("✅ Database stamped successfully")
                else:
                    print("✅ Clean database - no tables found")
            else:
                print("✅ Migration tracking already set up")
            
    except Exception as e:
        print(f"❌ Error checking database state: {e}")
        return False
    finally:
        await engine.dispose()
    
    # Now run migrations
    print("")
    print("🚀 Running migrations...")
    result = subprocess.run(
        ["alembic", "upgrade", "head"],
        capture_output=True,
        text=True
    )
    
    print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    
    if result.returncode != 0:
        print("❌ Migration failed")
        return False
    
    print("✅ Migrations completed successfully")
    return True


if __name__ == "__main__":
    success = asyncio.run(safe_migrate())
    sys.exit(0 if success else 1)
