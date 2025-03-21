# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace values with your PostgreSQL credentials
DATABASE_URL = "postgresql+psycopg2://postgres:password1234@localhost/equipment_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
