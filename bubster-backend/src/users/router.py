# src/users/router

import logfire
from argon2 import PasswordHasher
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db import get_async_session
from src.schemas import UserPublicWithQuotes
from src.users.models import User
from src.users.schemas import(
    UserCreate,
    UserPublic,
    UserUpdate
)
from uuid import UUID


router = APIRouter(
    prefix="/users"
)


def get_hash_response(pswd: str) -> str:
    ph = PasswordHasher()
    return ph.hash(pswd)


@router.post("", response_model=UserPublic)
async def create_user(
    *,
    session: AsyncSession = Depends(get_async_session),
    user: UserCreate
):
    hashed_pwd = get_hash_response(user.password)
    pwd_data = {"hashed_password": hashed_pwd}
    user_obj = User.model_validate(user, update=pwd_data)
    session.add(user_obj)

    await session.commit()
    await session.refresh(user_obj)
    logfire.info(f":::email:::{user.email} :::username:::{user.username} :::quotes:::{user.quotes} :::", quote=quote_obj)

    return user_obj


@router.get("", response_model=list[UserPublic])
async def get_users(
    *,
    session: AsyncSession = Depends(get_async_session),
):
    statement = select(User)
    results = await session.exec(statement)
    users = results.all()

    logfire.info("requesting user list ::: {name}", name="Adam K.")

    return users 


@router.get("/user_id", response_model=list[UserPublicWithQuotes])
async def get_user(
    *,
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session),
):
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="user not found")


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(
    *,
    session: AsyncSession = Depends(get_async_session),
    user_id: UUID,
    user: UserUpdate
):
    db_user = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user.model_dump(exclude_unset=True)
    for k, v in user_data.items():
        setattr(db_user, k, v)

    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)

    return db_user


