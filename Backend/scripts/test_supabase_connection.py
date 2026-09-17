#!/usr/bin/env python3
"""
Test Supabase PostgreSQL connection before running the full backend.
Usage: uv run python scripts/test_supabase_connection.py
"""

import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from sqlalchemy.ext.asyncio import create_async_engine
from credlayer.core.config import get_settings


async def test_connection():
    """Test database connection to Supabase."""
    settings = get_settings()
    
    print("🔍 Testing Supabase PostgreSQL connection...")
    
    # Debug: Show the actual URL being used
    db_url = settings.database_url
    if '@' in db_url:
        # Show sanitized version
        parts = db_url.split('@')
        sanitized = parts[0].split(':')[0:2]  # protocol and user
        print(f"📍 Database URL: {sanitized[0]}://****@{parts[1]}")
    else:
        print(f"📍 Database URL: {db_url}")
    
    if not db_url or db_url == "":
        print("❌ DATABASE_URL is empty!")
        return False
    
    try:
        # Create engine
        engine = create_async_engine(
            db_url,
            pool_pre_ping=True,
            echo=False
        )
        
        # Test connection
        async with engine.connect() as conn:
            from sqlalchemy import text
            result = await conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"✅ Connection successful!")
            print(f"📦 PostgreSQL Version: {version}")
            
        await engine.dispose()
        print("\n🎉 Supabase connection is working correctly!")
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {e}")
        print("\n💡 Troubleshooting:")
        print("   1. Check your DATABASE_URL in .env file")
        print("   2. Ensure format: postgresql+asyncpg://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres")
        print("   3. Verify your Supabase project is active")
        print("   4. Check your password is correct (no special characters issues)")
        print("\n📚 See SUPABASE_SETUP.md for detailed setup instructions")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)
