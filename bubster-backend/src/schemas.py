# src/schemas

from src.quotes import QuotePublic
from src.users import UserPublic


class QuotePublicWithUser(QuotePublic):
    user: UserPublic | None = None


class UserPublicWithQuotes(UserPublic):
    quotes: list[QuotePublic] = []


