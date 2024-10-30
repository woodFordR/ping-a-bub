# src/config

from pydantic import PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )
    
    testing: bool
    environment: str
    db_url: PostgresDsn
    redis_url: RedisDsn = 'redis://redis@localhost:6379/1'


settings = Settings()


