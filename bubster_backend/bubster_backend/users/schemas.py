# src/users/schemas

from pydantic import EmailStr
from sqlmodel import Field, SQLModel 
from sqlalchemy.ext.asyncio import AsyncAttrs
from uuid import UUID


# user base model
class UserBase(AsyncAttrs, SQLModel):
    email: EmailStr = Field(unique=True, index=True)
    username: str


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: UUID


class UserUpdate(SQLModel):
    email: EmailStr | None = None
    username: str | None = None
    password: str | None = None


