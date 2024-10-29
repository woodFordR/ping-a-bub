import logfire
import os

from fastapi import APIRouter
from app.config import get_environment
from app.schemas import HealthPublic


router = APIRouter(
    prefix="/health"
)


@router.get("/ping", response_model=HealthPublic)
async def pong():
    env = os.environ["ENVIRONMENT"]
    logfire.info("The health/ping environment shows '{env}'.", env=env)

    return {
        "ping_health": "bubs open, pong!",
        "environment": env
    }

