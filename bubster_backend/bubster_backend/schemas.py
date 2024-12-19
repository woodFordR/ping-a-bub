# bubster_backend/schemas

from bubster_backend.quotes.schemas import QuotePublic
from bubster_backend.users.schemas import UserPublic


class QuotePublicWithUser(QuotePublic):
    user: UserPublic | None = None


class UserPublicWithQuotes(UserPublic):
    quotes: list[QuotePublic] = []


