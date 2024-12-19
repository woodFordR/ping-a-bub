# bubster_backend/health/schemas

from sqlmodel import SQLModel


class HealthPublic(SQLModel):
    ping_health: str
    environment: str


class Status(SQLModel):
    message: str


