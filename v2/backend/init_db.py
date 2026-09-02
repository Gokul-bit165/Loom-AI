import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

admin_pass = os.environ.get("PG_ADMIN_PASSWORD", "kishore")
conn = psycopg2.connect(host='localhost', port=5432, user='postgres', password=admin_pass)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

cur.execute("SELECT 1 FROM pg_roles WHERE rolname='loom_ai_v2'")
if not cur.fetchone():
    cur.execute("CREATE ROLE loom_ai_v2 WITH LOGIN PASSWORD 'loom_ai_pass_2026' SUPERUSER CREATEDB")
    print("Created role loom_ai_v2")
else:
    cur.execute("ALTER ROLE loom_ai_v2 WITH PASSWORD 'loom_ai_pass_2026' SUPERUSER CREATEDB")
    print("Updated role loom_ai_v2")

for db in ['loom_ai_v2', 'loom_ai_v2_test']:
    cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{db}'")
    if not cur.fetchone():
        cur.execute(f"CREATE DATABASE {db} OWNER loom_ai_v2")
        print(f"Created database {db}")
    else:
        print(f"Database {db} exists")

cur.close()
conn.close()
print("Postgres initialization complete!")
