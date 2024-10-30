from sqlmodel import Session, SQLModel, create_engine
from src.config import settings


engine = create_engine(settings.db_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# space + / to comment
def get_session():
    with Session(engine) as session:
        yield session


