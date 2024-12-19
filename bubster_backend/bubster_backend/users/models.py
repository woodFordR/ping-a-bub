# src/users/models

from sqlmodel import Relationship, Field
from bubster_backend import IdentifyModel, TimestampModel
from .schemas import UserBase
from typing import List, Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from src.quotes import Quote


# user model
class User(
    UserBase,
    IdentifyModel,
    TimestampModel,
    table=True
):
    __tablename__ = "users"
    
    hashed_password: str = Field()
    quotes: Optional[List["Quote"]] = Relationship(
        back_populates="user"
    )


