# src/config

from src.constants import constants
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_url: str = constants.db_url
    site_domain: str = "dev.battlebit.app"
    environment: str = constants.environment

settings = Settings()

