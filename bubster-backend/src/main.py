# src/main

from datetime import datetime
import logfire
from fastapi import FastAPI
from fastapi.routing import APIRoute
from logging import basicConfig, getLogger
from src import settings
import src.health.router as health
import src.quotes.router as quotes
import src.users.router as users


def config_routing_operation_ids(app: FastAPI) -> None:
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = f"{route.name}-{datetime.now().strftime("%m%d%y-%H:%M")}"


def create_application() -> FastAPI:
    logfire.configure(
        service_name="src_main"
    )
    basicConfig(handlers=[logfire.LogfireLoggingHandler()])
    log = getLogger("uvicorn")

    application = FastAPI(debug=settings.debug)

    logfire.instrument_fastapi(application)
    log.info('Hello Bubster!')

    application.include_router(health.router)
    application.include_router(quotes.router)
    application.include_router(users.router)
    config_routing_operation_ids(application)

    return application


app = create_application()


