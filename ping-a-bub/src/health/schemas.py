from pydantic import BaseModel


class HealthPublic(BaseModel):
    ping_health: str
    environment: str


class Status(BaseModel):
    message: str


