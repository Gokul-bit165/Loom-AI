import sqlite3

conn = sqlite3.connect('v2/backend/loom_ai_v2.db')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in c.fetchall()]
print("=== loom_ai_v2.db Tables & Row Counts ===")
for t in sorted(tables):
    c.execute(f"SELECT count(*) FROM {t}")
    cnt = c.fetchone()[0]
    print(f"  {t}: {cnt} rows")

c.execute("SELECT min(work_date), max(work_date) FROM production_log")
print("ProductionLog date range:", c.fetchone())
c.execute("SELECT min(work_date), max(work_date) FROM stop_event")
print("StopEvent date range:", c.fetchone())
c.execute("SELECT count(*) FROM loom WHERE active=1")
print("Active looms:", c.fetchone()[0])
