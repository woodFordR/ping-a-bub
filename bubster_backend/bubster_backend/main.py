# bubster_backend/main

from datetime import datetime
import logfire
from fastapi import FastAPI
from fastapi.routing import APIRoute
from bubster_backend import settings
from bubster_backend.db import async_engine
import bubster_backend.health.router as health
import bubster_backend.quotes.router as quotes
import bubster_backend.users.router as users


def config_routing_operation_ids(app: FastAPI) -> None:
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = f"{route.name}-{datetime.now().strftime("%m%d%y-%H:%M")}"


def create_application() -> FastAPI:
    application = FastAPI(debug=settings.debug)

    logfire.configure(
        service_name="bubster_backend"
    )
    logfire.instrument_fastapi(application)

    application.include_router(health.router)
    application.include_router(quotes.router)
    application.include_router(users.router)
    config_routing_operation_ids(application)

    return application


app = create_application()


