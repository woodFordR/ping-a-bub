# bubster_backend/quotes/schemas

from bubster_backend.models import Category
from sqlmodel import Column, Enum, Field, SQLModel
from sqlalchemy.ext.asyncio import AsyncAttrs
from uuid import UUID as uuid_id, uuid4


# quote base model
class QuoteBase(
    AsyncAttrs,
    SQLModel
):
    author_name: str = Field(index=True)
    category: Category = Field(Column(Enum(Category)))
    text: str
    user_id: uuid_id = Field(
        default_factory=uuid4,
        foreign_key="users.id"
    )


class QuoteCreate(QuoteBase):
    pass


class QuotePublic(QuoteBase):
    id: uuid_id


class QuoteUpdate(SQLModel):
    text: str | None = None
    author_name: str | None = None
    category: Category | None = None
    user_id: uuid_id | None = None

