# src/quotes/__init__.py

from .models import Quote, QuoteCreate, QuotePublic, QuoteUpdate

# expose classes for other mods
__all__ = [
    "Quote", "QuoteCreate", "QuotePublic", "QuoteUpdate"
]

