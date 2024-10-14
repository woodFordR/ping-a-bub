# ping-a-bub/app/main.py

import os

from .config import get_environment, register_orm
from contextlib import asynccontextmanager
from fastapi import FastAPI
from .routers import router
from tortoise import Tortoise, generate_config
from tortoise.contrib.fastapi import RegisterTortoise
from typing import AsyncGenerator


@asynccontextmanager
async def lifespan_test(app: FastAPI) -> AsyncGenerator[None, None]:
    config = generate_config(
        os.getenv("DATABASE_TEST_URL"),
        app_modules={"models": ["models"]},
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
        


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="")



@app.get("/ping")
async def pong():
    return {
        "ping": "pong!",
        "ënvironment": get_environment(),
    }

