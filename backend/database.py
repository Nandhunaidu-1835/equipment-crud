# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os 

# Replace values with your PostgreSQL credentials
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:password1234@equipment_db:5432/equipment_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
