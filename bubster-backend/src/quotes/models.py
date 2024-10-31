# src/quotes/models

from sqlmodel import Relationship
from src import IdentifyModel, TimestampModel
from src.quotes.schemas import QuoteBase
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from src.users.models import User


# quote model & table
class Quote(
    TimestampModel,
    QuoteBase,
    IdentifyModel,
    table=True
):
    __tablename__ = "quotes"
    user: "User" = Relationship(back_populates="quotes")


