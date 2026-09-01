from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.db_models import Base
from app.seed.masters import seed_masters
from app.seed.demo_generator import generate_atm_month

engine = create_engine(settings.database_url)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TYPE employee_role ADD VALUE IF NOT EXISTS 'OTHER'"))
        conn.commit()
    except Exception as e:
        print("Enum note:", e)

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
with Session() as session:
    seed_masters(session)
    generate_atm_month(session)
    session.commit()
print("Main DB loom_ai_v2 seeded successfully!")
