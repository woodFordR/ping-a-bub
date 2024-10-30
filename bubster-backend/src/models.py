# global src/models

import uuid as identify
from datetime import datetime
from sqlalchemy import text
from sqlmodel import Field, SQLModel


class IdentifyModel(SQLModel):
    id: identify.UUID = Field(
        default_factory=identify.uuid4,
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


