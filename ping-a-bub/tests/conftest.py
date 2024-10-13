# ping-a-bub/tests/conftest.py

import os

import pytest
from starlette.testclient import TestClient

from app.main import app
from app.config import get_settings, Settings

def get_settings_override():
    return Settings(testing=1,database_url=os.environ.get("DATABASE_TEST_URL"),environment='test')


@pytest.fixture(scope="module")
def test_app():
    app.dependency_overrides[get_settings] = get_settings_override
    with TestClient(app) as test_client:
        yield test_client
        test_client.clear()

