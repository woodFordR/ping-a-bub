# app/config.py

import os
import logfire
from functools import lru_cache


# the register_tortoise helper is now compatible with async context managers
# https://github.com/testdrivenio/fastapi-tdd-docker/issues/31


@lru_cache()
def get_environment() -> str:
    logfire.info("Printing env from globals ...")
    return os.getenv("ENVIRONMENT", "dev")


