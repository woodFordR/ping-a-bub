# src/health/models

from pydantic.dataclasses import dataclass


@dataclass
class HealthCheck:
    ping_health: str
    environment: str
    ping_time: str


