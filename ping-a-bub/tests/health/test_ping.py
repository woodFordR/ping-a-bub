from fastapi.testclient import TestClient
from sqlmodel import Session
from src.main import app
from src.db import get_session


def test_health_ping(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)

    response = client.get("/health/ping")

    app.dependency_overrides.clear()
    data = response.json()

    assert response.status_code == 200
    assert data["environment"] == "development"
    assert data["ping_health"] == "Hello Main Bubster."


