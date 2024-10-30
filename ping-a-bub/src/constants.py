import os
from pydantic_settings import BaseSettings


class Constants(BaseSettings):
    environment: str | None = os.environ["ENVIRONMENT"]
    db_url: str | None = os.environ["DB_URL"]


constants = Constants()

