import os
from sqlmodel import SQLModel, create_engine

postgresql_url = os.getenv("DATABASE_URL")

engine = create_engine(postgresql_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

