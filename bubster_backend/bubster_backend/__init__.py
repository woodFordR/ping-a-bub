# bubster_backend/__init__

from bubster_backend.config import Settings 
from bubster_backend.models import IdentifyModel, TimestampModel


settings = Settings()

__all__=["IdentifyModel", "TimestampModel"]


