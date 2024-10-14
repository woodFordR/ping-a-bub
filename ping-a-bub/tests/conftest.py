# ping-a-bub/tests/conftest.py

import os

import pytest
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Tuple
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.config import get_settings, Settings


ClientManagerType = AsyncGenerator[AsyncClient, None]

def get_settings_override():
    return Settings(testing=1,database_url=os.environ.get("DATABASE_TEST_URL"),environment='test')


@asynccontextmanager
async def client_manager(app, base_url="http://test", **kw) -> ClientManagerType:
    app.state.testing = True
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url=base_url, **kw) as c:
            yield c


@pytest.fixture(scope="module")
async def client() -> ClientManagerType:
    async with client_manager(app) as c:
        yield c

