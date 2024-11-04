# src/quotes/router

import logfire
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db import get_async_session
from src.schemas import QuotePublicWithUser
from .models import Quote
from .schemas import (
    QuoteCreate,
    QuotePublic,
    QuoteUpdate
)
from uuid import UUID


router = APIRouter(
    prefix="/quotes"
)


@router.get("", response_model=list[QuotePublicWithUser])
async def get_quotes(
    *,
    session: AsyncSession = Depends(get_async_session),
):
    statement = select(Quote)
    quotes_obj = (await session.exec(statement)).all()

    logfire.info("Admin Requesting = {name}", name="Adam K.")
    for quote in quotes_obj:
        await quote.awaitable_attrs.user
    
    return quotes_obj


@router.post("", response_model=QuotePublic)
async def create_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote: QuoteCreate
):
    quote_obj = Quote.model_validate(quote)
    session.add(quote_obj)

    await session.commit()
    await session.refresh(quote_obj)
    logfire.info(f":::author:::{quote.author_name} :::category:::{quote.category} :::quote:::{quote.text} :::", quote=quote_obj)

    return quote_obj


@router.get("/{quote_id}", response_model=QuotePublicWithUser)
async def get_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote_id: str
):
    quote = await session.get(Quote, quote_id)

    if not quote:
        raise HTTPException(status_code=404, detail="quote not found")

    user = await quote.awaitable_attrs.user
    logfire.info(f":::user:::{ user } :::quote:::{ quote } :::", user=user, quote=quote)
    return quote


@router.patch("/{quote_id}", response_model=QuotePublic)
async def update_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote_id: str,
    quote: QuoteUpdate
):
    statement = select(Quote).where(Quote.id == quote_id)
    db_quote = (await session.exec(statement)).one_or_none()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    quote_data = quote.model_dump(exclude_unset=True)
    for k, v in quote_data.items():
        setattr(db_quote, k, v)

    session.add(db_quote)
    await session.commit()
    await session.refresh(db_quote)

    return db_quote


@router.delete("/{quote_id}")
async def delete_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote_id: str
):
    statement = select(Quote).where(Quote.id == quote_id)
    quote = (await session.exec(statement)).one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    author = quote.author_name

    await session.delete(quote)
    await session.commit()

    return {
        "ok": True,
        "deleted_author": author,
        "deleted_id": quote_id
    }



