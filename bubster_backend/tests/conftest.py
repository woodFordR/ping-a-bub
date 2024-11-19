import pytest
from httpx import ASGITransport, AsyncClient
from typing import AsyncGenerator
from bubster_backend.main import app


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    host, port = "127.0.0.1", "9000"

    async with AsyncClient(transport=ASGITransport(app=app, client=(host, port)), base_url="http://test") as client:
        yield client


