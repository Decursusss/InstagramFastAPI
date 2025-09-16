from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.base import Base
from db import models
 
SQLALCHEMY_DATABASE_URL = "sqlite:///./fastapi-practice.db"
 
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(engine)