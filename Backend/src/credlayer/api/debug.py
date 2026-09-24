"""Debug endpoints for troubleshooting deployment issues."""
from __future__ import annotations

import structlog
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from credlayer.api.deps import get_db_session

logger = structlog.get_logger(__name__)

# Debug endpoints - only enable in development/staging
router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/schema-check")
async def check_schema(db: AsyncSession = Depends(get_db_session)) -> dict:
    """Check database schema to diagnose migration issues."""
    
    try:
        # Check alembic version
        result = await db.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'alembic_version'
            );
        """))
        alembic_exists = result.scalar()
        
        migration_version = None
        if alembic_exists:
            result = await db.execute(text("SELECT version_num FROM alembic_version;"))
            migration_version = result.scalar()
        
        # Get all tables
        result = await db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """))
        tables = [row[0] for row in result.fetchall()]
        
        # Check specific table columns
        table_columns = {}
        for table in ['credentials', 'connections', 'activity', 'request_logs']:
            if table in tables:
                result = await db.execute(text(f"""
                    SELECT column_name
                    FROM information_schema.columns 
                    WHERE table_name = '{table}'
                    ORDER BY ordinal_position;
                """))
                table_columns[table] = [row[0] for row in result.fetchall()]
        
        return {
            "alembic_tracking": alembic_exists,
            "migration_version": migration_version,
            "total_tables": len(tables),
            "tables": tables,
            "table_columns": table_columns,
            "status": "ok" if alembic_exists and migration_version else "needs_migration"
        }
        
    except Exception as e:
        logger.exception("schema_check_failed", error=str(e))
        return {
            "status": "error",
            "error": str(e)
        }


@router.get("/test-query/{wallet}")
async def test_query(wallet: str, db: AsyncSession = Depends(get_db_session)) -> dict:
    """Test a simple query to diagnose database issues."""
    
    results = {}
    
    # Test credentials query
    try:
        result = await db.execute(text("""
            SELECT COUNT(*) FROM credentials WHERE wallet_address = :wallet
        """), {"wallet": wallet})
        results["credentials_count"] = result.scalar()
        results["credentials_status"] = "ok"
    except Exception as e:
        results["credentials_status"] = "error"
        results["credentials_error"] = str(e)
    
    # Test connections query
    try:
        result = await db.execute(text("""
            SELECT COUNT(*) FROM connections WHERE from_wallet = :wallet OR to_wallet = :wallet
        """), {"wallet": wallet})
        results["connections_count"] = result.scalar()
        results["connections_status"] = "ok"
    except Exception as e:
        results["connections_status"] = "error"
        results["connections_error"] = str(e)
    
    # Test activity query
    try:
        result = await db.execute(text("""
            SELECT COUNT(*) FROM activity WHERE wallet_address = :wallet
        """), {"wallet": wallet})
        results["activity_count"] = result.scalar()
        results["activity_status"] = "ok"
    except Exception as e:
        results["activity_status"] = "error"
        results["activity_error"] = str(e)
    
    return results
