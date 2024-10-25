# ping-a-bub/app/main.py

import logfire
import os

from contextlib import asynccontextmanager
from fastapi import FastAPI
from tortoise import Tortoise, generate_config
from tortoise.contrib.fastapi import RegisterTortoise
from typing import AsyncGenerator

from app.config import register_orm
from app.bub import health, quotes


# https://github.com/testdrivenio/fastapi-tdd-docker/issues/31
# this issue has solved the register_tortoise helper being compatible
# with async context managers

@asynccontextmanager
async def lifespan_test(app: FastAPI) -> AsyncGenerator[None, None]:
    config = generate_config(
        db_url=os.getenv("DATABASE_TEST_URL"),
        app_modules={"models": ["app.models.quotes"]},
        testing=True,
        connection_label="models",
    )
    async with RegisterTortoise(
        app=app,
        config=config,
        generate_schemas=True,
        add_exception_handlers=True,
        _create_db=True,
    ):
        yield

    await Tortoise._drop_databases()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    if getattr(app.state, "testing", None):
        async with lifespan_test(app) as _:
            yield
    else:
        async with register_orm(app):
            yield
        

def create_application() -> FastAPI:

    application = FastAPI(lifespan=lifespan)
    logfire.configure(
        service_name="app_main"
    )
    logfire.instrument_fastapi(application)
    logfire.info('Hello, {name}!', name='Woody')

    application.include_router(health.router)
    application.include_router(quotes.router)

    return application


app = create_application()

