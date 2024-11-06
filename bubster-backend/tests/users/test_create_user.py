# import pytest
# import trio
# from httpx import ASGITransport, AsyncClient
# from src.main import app
#
#
# @pytest.mark.anyio
# async def test_create_user():
#     async with AsyncClient(
#         transport=ASGITransport(app=app), base_url="http://test"
#     ) as ac:
#         response = await ac.post(
#             "/users",
#             json={"email": "chewy@woodford.life",
#                 "username": "furrball",
#                 "password": "abcd1234"
#             },
#         )
#
#     assert response.status_code == 200
#     user = response.json()
#     assert user["id"] is not False 
#     assert user["username"] == "furrball"
#
