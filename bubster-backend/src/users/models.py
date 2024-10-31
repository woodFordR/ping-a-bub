# src/users/models

from sqlmodel import Relationship, Field
from src import IdentifyModel, TimestampModel
from src.users.schemas import UserBase
from typing import List, TYPE_CHECKING


if TYPE_CHECKING:
    from src.quotes.models import Quote


# user model
class User(
    UserBase,
    IdentifyModel,
    TimestampModel,
    table=True
):
    __tablename__ = "users"
    
    hashed_password: str = Field()
    quotes: List["Quote"] = Relationship(back_populates="user")


