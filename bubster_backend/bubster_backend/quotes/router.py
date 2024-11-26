# bubster_backend/quotes/router

import logfire
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import column, select
from sqlmodel.ext.asyncio.session import AsyncSession
from bubster_backend.db import get_async_session
from bubster_backend.schemas import QuotePublicWithUser
from .models import Quote
from .schemas import (
    QuoteCreate,
    QuotePublic,
    QuoteUpdate
)


router = APIRouter(
    prefix="/quotes"
)

logfire.configure()
logfire.instrument_asyncpg()


@router.get("", response_model=list[QuotePublicWithUser])
async def get_quotes(
    *,
    session: AsyncSession = Depends(get_async_session),
):
    with logfire.span("query for quotes from db ..."):
        statement = select(Quote)
        quotes_obj = (await session.exec(statement)).all()

        for quote in quotes_obj:
            await quote.awaitable_attrs.user
    
    return quotes_obj


@router.post("", response_model=QuotePublic)
async def create_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote: QuoteCreate
):
    with logfire.span("creating a quote ..."):
        quote_obj = Quote.model_validate(quote)
        session.add(quote_obj)

        await session.commit()
        await session.refresh(quote_obj)
        logfire.info("quote created id# {id=}", id=quote_obj.id)

    return quote_obj


@router.get("/{quote_id}", response_model=QuotePublicWithUser)
async def get_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote_id: str
):
    with logfire.span("grabbing quote id# {id=}", id=quote_id):
        quote = await session.get(Quote, quote_id)
        if not quote:
            raise HTTPException(status_code=404, detail="quote not found")

        await quote.awaitable_attrs.user
        logfire.info(f"quote author: {quote.author_name}, category: {quote.category}")

    return quote


@router.patch("/{quote_id}", response_model=QuotePublic)
async def update_quote(
    *,
    session: AsyncSession = Depends(get_async_session),
    quote_id: str,
    quote: QuoteUpdate
):
    with logfire.span("grabbing quote id# {id=}", id=quote_id):
        statement = select(Quote).where(Quote.id == quote_id)
        db_quote = (await session.exec(statement)).one_or_none()
        if not db_quote:
            raise HTTPException(status_code=404, detail="Quote not found")

        quote_data = quote.model_dump(exclude_unset=True)
        for k, v in quote_data.items():
            logfire.info("quote updated {key=} to {value=}", key=k, value=v)
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
    with logfire.span("deleting quote id# {id=}", id=quote_id):
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


@router.get("/search/{search_term}", response_model=list[QuotePublic])
async def search_quotes(
    *,
    session: AsyncSession = Depends(get_async_session),
    search_term: str
):
    # ordering = ''
    # offset = ''
    # limit = ''
    with logfire.span("searching quotes ..."):
        statement = select(Quote).filter(
            column("text").contains(search_term)
        )
        # .order_by(ordering).offset(offset).limit(limit).all()
        quotes = (await session.exec(statement)).all()
        if not quotes:
            return {"error": "no quotes found"}
        return quotes


