# app/bub/health.py

import logfire

from fastapi import APIRouter
from app.config import get_environment

router = APIRouter(
    prefix="/health"
)
logfire.configure(
    service_name="health"
)


@router.get("/ping")
async def pong():
    return {
        "ping_health": "bubs open!",
        "environment": get_environment()
    }

