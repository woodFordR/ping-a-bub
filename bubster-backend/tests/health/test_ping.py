import pytest
import trio
from httpx import ASGITransport, AsyncClient
from src.main import app


@pytest.mark.anyio
async def test_health_ping():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get(
            "/health/ping",
        )

    assert response.status_code == 200
    ping = response.json()
    assert ping["ping_health"] == "Hello Main Bubster." 
    assert ping["environment"] == "development"

