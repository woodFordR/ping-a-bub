# ping-a-bub/app/config.py

import logging
import os
from functools import lru_cache, partial

from tortoise.contrib.fastapi import RegisterTortoise

log = logging.getLogger("uvicorn")

# https://github.com/testdrivenio/fastapi-tdd-docker/issues/31
# this issue has solved the register_tortoise helper being compatible
# with async context managers

register_orm = partial(
    RegisterTortoise,
    db_url=os.getenv("DATABASE_URL"),
    modules={"models": ["app.models.quotes"]},
    generate_schemas=True,
    add_exception_handlers=True,
)


@lru_cache()
def get_environment() -> str:
    log.info("Printing env from globals ...")
    return os.getenv("ENVIRONMENT", "dev")


