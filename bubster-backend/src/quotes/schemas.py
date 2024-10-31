# src/quotes/schemas

from sqlmodel import SQLModel, Field
from uuid import UUID


# quote base model
class QuoteBase(SQLModel):
    author_name: str = Field(index=True)
    category: str = Field(default="bubster")
    text: str
    user_id: UUID | None = Field(default=None, foreign_key="users.id")


class QuoteCreate(QuoteBase):
    pass


class QuotePublic(QuoteBase):
    id: UUID


class QuoteUpdate(SQLModel):
    text: str | None = None
    author_name: str | None = None
    category: str | None = None
    user_id: UUID | None = None

