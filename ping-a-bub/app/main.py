# app/main.py

import logfire

from app.bub import health, quotes
from app.db import create_db_and_tables, engine
from contextlib import asynccontextmanager
from fastapi import FastAPI
from logging import basicConfig, getLogger
from sqlmodel import Session


def get_session():
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_application() -> FastAPI:
    logfire.configure(
        service_name="app_main"
    )
    basicConfig(handlers=[logfire.LogfireLoggingHandler()])
    log = getLogger("uvicorn")

    create_db_and_tables()
    application = FastAPI(lifespan=lifespan)

    logfire.instrument_fastapi(application)
    log.info('Hello, ping-a-bub!')


    application.include_router(health.router)
    application.include_router(quotes.router)

    return application


app = create_application()

# error running sqlmodel first time 10-28-24
# https://www.psycopg.org/articles/2018/02/08/psycopg-274-released/

