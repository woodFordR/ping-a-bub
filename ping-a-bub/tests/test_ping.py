import pytest
from app.main import app
from httpx import AsyncClient

@pytest.fixture(scope="module")
def anyio_backend() -> str:
    return "asyncio"


@pytest.mark.anyio
async def test_ping(client: AsyncClient) -> None:
    response = await client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ping": "pong!", "environment": "dev"}

