import uuid
from sqlmodel import Field, SQLModel
from src.models import IdentifyModel, TimestampModel


# quote base model
class QuoteBase(SQLModel):
    author_name: str = Field(index=True)
    category: str = Field(default="everything")
    text: str


# quote model
class Quote(
    TimestampModel,
    QuoteBase,
    IdentifyModel,
    table=True
):
    pass


class QuoteCreate(QuoteBase):
    pass


class QuotePublic(QuoteBase):
    id: uuid.UUID


class QuoteUpdate(SQLModel):
    text: str | None = None
    author_name: str | None = None


class Status(SQLModel):
    message: str


