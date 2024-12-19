# bubster_backend/health/router

import logfire
from datetime import datetime
from fastapi import APIRouter
from bubster_backend import settings
from .models import HealthCheck


router = APIRouter(
    prefix="/health"
)


@router.get("/ping", response_model=HealthCheck)
async def pong():
    with logfire.span('checking health status ...'):
        return {
            "ping_health": "Hello Main Bubster.",
            "environment": settings.environment,
            "ping_time": 
                datetime.now().strftime("%m/%d/%y at %I:%M%p")
        }


