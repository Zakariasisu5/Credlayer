def init_engine(settings: Settings) -> AsyncEngine:
    global _engine, _session_factory
    
    # Configure connect_args for asyncpg to fix Supabase pgbouncer compatibility
    connect_args = {}
    if "supabase" in settings.database_url or "pgbouncer" in settings.database_url:
        # Disable prepared statement cache for pgbouncer/Supavisor compatibility
        connect_args["statement_cache_size"] = 0
    
    _engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
        connect_args=connect_args
    )
    _session_factory = async_sessionmaker(_engine, expire_on_commit=False)
    return _engine