# src/schemas

from src.quotes.schemas import QuotePublic
from src.users.schemas import UserPublic


class QuotePublicWithUser(QuotePublic):
    user: UserPublic | None = None


class UserPublicWithQuotes(UserPublic):
    quotes: list[QuotePublic] = []


