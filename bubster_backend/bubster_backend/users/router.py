# src/users/router

import logfire
from argon2 import PasswordHasher
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from bubster_backend.db import get_async_session
from bubster_backend.schemas import UserPublicWithQuotes
from .models import User
from .schemas import(
    UserCreate,
    UserPublic,
    UserUpdate
)


router = APIRouter(
    prefix="/users"
)

logfire.configure()


def get_hash_response(pswd: str) -> str:
    ph = PasswordHasher()
    return ph.hash(pswd)


@router.post("", response_model=UserPublic)
async def create_user(
    *,
    session: AsyncSession = Depends(get_async_session),
    user: UserCreate
):
    with logfire.span("creating a user ..."):
        hashed_pwd = get_hash_response(user.password)
        pwd_data = {"hashed_password": hashed_pwd}
        user_obj = User.model_validate(user, update=pwd_data)
        session.add(user_obj)

        await session.commit()
        await session.refresh(user_obj)
        logfire.info("user {username=} created with {email=}", username=user.username, email=user.email)

    return user_obj


@router.get("", response_model=list[UserPublic])
async def get_users(
    *,
    session: AsyncSession = Depends(get_async_session),
):
    with logfire.span("querying all users ..."):
        statement = select(User)
        users = (await session.exec(statement)).all()

    return users 


@router.get("/{user_id}", response_model=UserPublicWithQuotes)
async def get_user(
    *,
    user_id: str,
    session: AsyncSession = Depends(get_async_session),
):
    with logfire.span("getting a user ..."):
        statement = select(User).where(User.id == user_id)
        user = (await session.exec(statement)).one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="user not found")
        logfire.info(f"{user.email} {user.username}")

        quote_count = len(await user.awaitable_attrs.quotes)
        logfire.info(f"user: {user.email} as {user.username};; quotes_count: {quote_count}")

    return user


@router.patch("/{user_id}", response_model=UserPublic)
async def update_user(
    *,
    session: AsyncSession = Depends(get_async_session),
    user_id: str,
    user: UserUpdate
):
    with logfire.span("updating a user ..."):
        statement = select(User).where(User.id == user_id)
        db_user = (await session.exec(statement)).one_or_none()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = user.model_dump(exclude_unset=True)
        for k, v in user_data.items():
            setattr(db_user, k, v)
            logfire.info("updated {key=} to {value=}", key=k, value=v)

        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)

    return db_user

@router.delete("/{user_id}")
async def delete_user(
    *,
    session: AsyncSession = Depends(get_async_session),
    user_id: str
):
    with logfire.span("deleting a user ..."):
        statement = select(User).where(User.id == user_id)
        user = (await session.exec(statement)).one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="this user has not been found." )
        
        user_name = user.username

        await session.delete(user)
        await session.commit()
        logfire.info(f"deleted {user_name} with id# {user_id}")

    return {
        "ok": True,
        "deleted_user": user_name,
        "deleted_id": user_id
    }


