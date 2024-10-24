# app/bub/ping.py

import logfire

from fastapi import APIRouter
from app.config import get_environment


router = APIRouter()
logfire.configure(
    service_name="pingabub-health"
)


@router.get("/ping")
async def pong():
    return {
        "ping": "bubster!",
        "environment": get_environment
    }

