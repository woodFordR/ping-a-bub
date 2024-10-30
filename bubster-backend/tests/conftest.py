import os
import pytest
from sqlmodel import Session, SQLModel, create_engine


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        os.environ["DB_URL"]
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


