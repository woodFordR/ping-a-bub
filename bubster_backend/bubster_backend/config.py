# src/config

from pydantic import PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )
    
    db_url: PostgresDsn
    debug: bool
    environment: str
    redis_url: RedisDsn = 'redis://redis@localhost:6379/1'
    testing: bool


