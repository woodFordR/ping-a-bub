import logfire

from fastapi import APIRouter
from src.config import settings
from .schemas import HealthPublic


router = APIRouter(
    prefix="/health"
)


@router.get("/ping", response_model=HealthPublic)
async def pong():
    logfire.info("The health/ping environment shows {env}.", env=settings.environment)

    return {
        "ping_health": "Hello Main Bubster.",
        "environment": settings.environment
    }

