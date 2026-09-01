-- Loom AI — Database and user setup
-- Run as: psql -U postgres -f setup_db.sql
-- This creates the loom_ai user and database.
-- It is safe to run multiple times (uses IF NOT EXISTS patterns).

-- Create the dedicated application user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'loom_ai') THEN
        CREATE ROLE loom_ai WITH LOGIN PASSWORD 'loom_ai_pass_2026';
        RAISE NOTICE 'Created role: loom_ai';
    ELSE
        -- Update password in case it changed
        ALTER ROLE loom_ai WITH LOGIN PASSWORD 'loom_ai_pass_2026';
        RAISE NOTICE 'Role loom_ai already exists — password updated.';
    END IF;
END
$$;

-- Create the application database
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'loom_ai' AND pid <> pg_backend_pid();

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'loom_ai') THEN
        -- Can't use CREATE DATABASE inside a transaction, so we just note it.
        RAISE NOTICE 'Database loom_ai does not exist — will be created below.';
    ELSE
        RAISE NOTICE 'Database loom_ai already exists.';
    END IF;
END
$$;
