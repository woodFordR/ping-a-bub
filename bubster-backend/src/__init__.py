# src/__init__

from src.config import Settings 
from src.models import IdentifyModel, TimestampModel


settings = Settings()

__all__=["IdentifyModel", "TimestampModel"]


