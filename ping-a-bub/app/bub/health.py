# app/bub/health.py

import logfire

from fastapi import APIRouter
from app.config import get_environment
from app.schemas import HealthPublic


router = APIRouter(
    prefix="/health"
)


@router.get("/ping", response_model=HealthPublic)
async def pong():
    env = get_environment()
    logfire.info("The health/ping environment shows '{env}'.", env=env)

    return {
        "ping_health": "bubs open, pong!",
        "environment": env
    }

