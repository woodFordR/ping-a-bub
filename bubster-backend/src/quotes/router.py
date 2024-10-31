# src/quotes/router

import logfire
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db import get_async_session
from src.schemas import QuotePublicWithUser
from src.quotes.models import Quote
from src.quotes.schemas import (
    QuoteCreate,
    QuotePublic,
    QuoteUpdate
)
from uuid import UUID


router = APIRouter(
    prefix="/quotes"
)


@router.get("", response_model=list[QuotePublic])
async def get_quotes(
    *,
    session: AsyncSession = Depends(get_async_session),
):
    statement = select(Quote)
    results = await session.exec(statement)
    quotes = results.all()

    logfire.info("Admin Requesting = {name}", name="Adam K.")

    return quotes 


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
    quote_id: UUID
):
    quote = await session.get(Quote, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="quote not found")
    return quote


@router.patch("/{quote_id}", response_model=QuotePublic)
async def update_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote_id: UUID,
    quote: QuoteUpdate
):
    db_quote = await session.get(Quote, quote_id)
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
    quote_id: UUID
):
    quote = await session.get(Quote, quote_id)
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



