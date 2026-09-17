#!/usr/bin/env python3
"""Check if .env file is being loaded correctly."""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from credlayer.core.config import get_settings

settings = get_settings()

print("=" * 60)
print("ENVIRONMENT CONFIGURATION CHECK")
print("=" * 60)
print(f"Environment: {settings.environment}")
print(f"Log Level: {settings.log_level}")
print(f"Database URL: {settings.database_url}")
print(f"Supabase URL: {settings.supabase_url}")
print(f"Service Role Key: {settings.supabase_service_role_key[:20]}..." if settings.supabase_service_role_key else "Not set")
print("=" * 60)

if settings.database_url == "postgresql+asyncpg://credlayer:credlayer@localhost:5432/credlayer":
    print("\n⚠️  WARNING: Using default DATABASE_URL!")
    print("Your .env file might not be loading correctly.")
    print("\nTroubleshooting:")
    print("1. Make sure .env file is in Backend/ directory")
    print("2. Check for syntax errors in .env file")
    print("3. Ensure no extra spaces or quotes around values")
else:
    print("\n✅ Custom DATABASE_URL detected - .env is loading!")
