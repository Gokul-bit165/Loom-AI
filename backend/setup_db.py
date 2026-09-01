"""
Loom AI — Database setup script.

This script:
1. Creates the loom_ai PostgreSQL role (if not exists)
2. Creates the loom_ai database (if not exists)
3. Grants all privileges on the database to loom_ai

Run as:
    cd backend
    python setup_db.py

Requires the postgres superuser password to be provided
(it will prompt if not in POSTGRES_SUPERUSER_PASSWORD env var).
"""
from __future__ import annotations

import os
import sys
import getpass

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


DB_NAME = "loom_ai"
DB_USER = "loom_ai"
DB_PASSWORD = "loom_ai_pass_2026"
HOST = "localhost"
PORT = 5432


def get_superuser_conn(password: str):
    """Connect to the postgres maintenance database as superuser."""
    return psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password=password,
        host=HOST,
        port=PORT,
    )


def main() -> None:
    # Try Windows peer auth first (no password needed for local connections)
    password = os.environ.get("POSTGRES_SUPERUSER_PASSWORD", "")
    
    if not password:
        print("Connecting to PostgreSQL as superuser (postgres).")
        print("If your postgres superuser has no password set (Windows local trust auth),")
        print("just press Enter when prompted.")
        password = getpass.getpass("postgres superuser password (Enter for empty): ")

    try:
        conn = get_superuser_conn(password)
    except psycopg2.OperationalError as e:
        print(f"\nERROR: Could not connect as postgres: {e}")
        print("Check that PostgreSQL is running and the password is correct.")
        sys.exit(1)

    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # ── Create role ───────────────────────────────────────────────────────────
    cur.execute("SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = %s", (DB_USER,))
    if cur.fetchone():
        print(f"  Role '{DB_USER}' already exists — skipping create.")
        cur.execute(f"ALTER ROLE {DB_USER} WITH LOGIN PASSWORD %s", (DB_PASSWORD,))
        print(f"  Password updated for role '{DB_USER}'.")
    else:
        cur.execute(
            f"CREATE ROLE {DB_USER} WITH LOGIN PASSWORD %s",
            (DB_PASSWORD,),
        )
        print(f"  Created role '{DB_USER}'.")

    # ── Create database ───────────────────────────────────────────────────────
    cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_NAME,))
    if cur.fetchone():
        print(f"  Database '{DB_NAME}' already exists — skipping create.")
    else:
        cur.execute(f"CREATE DATABASE {DB_NAME} OWNER {DB_USER} ENCODING 'UTF8'")
        print(f"  Created database '{DB_NAME}'.")

    # ── Grant privileges ──────────────────────────────────────────────────────
    cur.execute(f"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER}")
    print(f"  Granted ALL PRIVILEGES on '{DB_NAME}' to '{DB_USER}'.")

    cur.close()
    conn.close()

    # ── Also grant schema privileges (connect to the new DB) ─────────────────
    try:
        conn2 = psycopg2.connect(
            dbname=DB_NAME, user="postgres", password=password, host=HOST, port=PORT
        )
        conn2.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur2 = conn2.cursor()
        cur2.execute(f"GRANT ALL ON SCHEMA public TO {DB_USER}")
        cur2.execute(f"ALTER DATABASE {DB_NAME} SET search_path TO public")
        cur2.close()
        conn2.close()
        print(f"  Granted schema public privileges to '{DB_USER}'.")
    except Exception as e:
        print(f"  Warning: could not grant schema privileges: {e}")

    print(f"\n  Database setup complete.")
    print(f"  Connection string: postgresql://{DB_USER}:{DB_PASSWORD}@{HOST}:{PORT}/{DB_NAME}")
    print(f"\n  Next step: cd backend && alembic upgrade head")


if __name__ == "__main__":
    main()
