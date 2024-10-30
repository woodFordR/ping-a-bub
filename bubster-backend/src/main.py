# src/main

from datetime import datetime
import logfire
from fastapi import FastAPI
from fastapi.routing import APIRoute
from logging import basicConfig, getLogger
from src.health import router as health
from src.quotes import router as quotes
from src.db import create_db_and_tables


def config_routing_operation_ids(app: FastAPI) -> None:
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = f"{route.name}--{datetime.now().strftime("%m%d%y--%H:%M")}"


def create_application() -> FastAPI:
    logfire.configure(
        service_name="src_main"
    )
    basicConfig(handlers=[logfire.LogfireLoggingHandler()])
    log = getLogger("uvicorn")

    create_db_and_tables()
    application = FastAPI()

    logfire.instrument_fastapi(application)
    log.info('Hello Bubster!')

    application.include_router(health.router)
    application.include_router(quotes.router)
    config_routing_operation_ids(application)

    return application


app = create_application()

# error running sqlmodel first time 10-28-24
# https://www.psycopg.org/articles/2018/02/08/psycopg-274-released/

# from contextlib import asynccontextmanager
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     yield

