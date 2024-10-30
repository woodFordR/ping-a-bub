import uuid
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


# Quote base model for quotes
class QuoteBase(SQLModel):
    author_name: str = Field(index=True)
    category: str = Field(default="everything")
    text: str


# Quote model for quotes
class Quote(QuoteBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class QuoteCreate(QuoteBase):
    pass


class QuotePublic(QuoteBase):
    id: uuid.UUID
    text: str
    author_name: str

class Status(BaseModel):
    message: str

