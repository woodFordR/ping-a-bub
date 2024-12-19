# bubster_backend/db

from bubster_backend import settings
import logfire
from bubster_backend.quotes.models import Quote
from sqlalchemy.event import listens_for
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import AsyncGenerator


engine = create_async_engine(
    str(settings.db_url),
    echo=True,
    future=True
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session


@listens_for(Quote.text, "set")
def receive_set(target, value, oldvalue, initiator):
    with logfire.span("comments_on_sql_events"):
        statement = f"{target} + {value} + {oldvalue} + {initiator}"
        logfire.info(f"statement:: {statement}")


