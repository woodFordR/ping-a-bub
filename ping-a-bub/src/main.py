# src/main

import logfire
from contextlib import asynccontextmanager
from fastapi import FastAPI
from logging import basicConfig, getLogger
from src.health import router as health
from src.quotes import router as quotes
from src.db import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_application() -> FastAPI:
    logfire.configure(
        service_name="src_main"
    )
    basicConfig(handlers=[logfire.LogfireLoggingHandler()])
    log = getLogger("uvicorn")

    create_db_and_tables()
    application = FastAPI(lifespan=lifespan)

    logfire.instrument_fastapi(application)
    log.info('Hello Bubster!')

    application.include_router(health.router)
    application.include_router(quotes.router)

    return application


app = create_application()

# error running sqlmodel first time 10-28-24
# https://www.psycopg.org/articles/2018/02/08/psycopg-274-released/

