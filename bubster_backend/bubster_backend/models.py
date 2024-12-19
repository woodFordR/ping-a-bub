# global bubster_backend/models

import enum
from datetime import datetime
from sqlmodel import Field, SQLModel, text
from uuid import uuid4, UUID as uuid_id


# category enum for quote model
class Category(str, enum.Enum):
    FUNNY = 'funny'
    HAPPY = 'happy'
    SAD = 'sad'
    ANGRY = 'angry'
    OTHER = 'other'


class IdentifyModel(SQLModel):
    id: uuid_id = Field(
        default_factory=uuid4,
        primary_key=True,
        index=True,
        sa_column_kwargs={
            "server_default": text("gen_random_uuid()"),
            "unique": True
        }
    )


class TimestampModel(SQLModel):
    created_at: datetime = Field(
        default_factory=datetime.now,
        nullable=False,
        sa_column_kwargs={
            "server_default": text("current_timestamp(0)")
        }
    )
    updated_at: datetime = Field(
        default_factory=datetime.now,
        nullable=False,
        sa_column_kwargs={
            "server_default": text("current_timestamp(0)"),
            "onupdate": text("current_timestamp(0)")
        }
    )


