-- Loom AI database setup
-- Run: psql -U postgres -h localhost -f backend/create_db.sql

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'loom_ai') THEN
        CREATE ROLE loom_ai WITH LOGIN PASSWORD 'loom_ai_pass_2026';
        RAISE NOTICE 'Created role: loom_ai';
    ELSE
        ALTER ROLE loom_ai WITH LOGIN PASSWORD 'loom_ai_pass_2026';
        RAISE NOTICE 'Role loom_ai already exists; password updated.';
    END IF;
END
$$;

SELECT 'Role check done' AS status;
