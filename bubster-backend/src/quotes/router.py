import logfire
import uuid
from src.quotes.models import Quote, QuoteCreate, QuotePublic, QuoteUpdate
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from src.db import engine


router = APIRouter(
    prefix="/quotes"
)


# space + / to comment
def get_session():
    with Session(engine) as session:
        yield session


@router.get("", response_model=list[QuotePublic])
async def get_quotes(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = Query(default=100, le=100),
):
    quotes = session.exec(select(Quote).offset(offset).limit(limit)).all()
    logfire.info("Admin Requesting = {name}", name="Adam K.")

    return quotes


@router.post("", response_model=QuotePublic)
async def create_quote(
    *,
    session: Session = Depends(get_session),
    quote: QuoteCreate
):
    quote_obj = Quote.model_validate(quote)
    session.add(quote_obj)
    session.commit()
    session.refresh(quote_obj)
    logfire.info("Quote Created ID #{quote.id}", quote=quote_obj)

    return quote_obj


@router.get("/{quote_id}", response_model=QuotePublic)
async def get_quote(
    *,
    session: Session = Depends(get_session),
    quote_id: uuid.UUID
):
    quote = session.get(Quote, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


@router.patch("/{quote_id}", response_model=QuotePublic)
async def update_quote(
    *,
    session: Session = Depends(get_session),
    quote_id: uuid.UUID,
    quote: QuoteUpdate
):
    db_quote = session.get(Quote, quote_id)
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    quote_data = quote.model_dump(exclude_unset=True)
    for k, v in quote_data.items():
        setattr(db_quote, k, v)

    session.add(db_quote)
    session.commit()
    session.refresh(db_quote)

    return db_quote


@router.delete("/{quote_id}")
async def delete_quote(
    *,
    session: Session = Depends(get_session),
    quote_id: uuid.UUID
):
    quote = session.get(Quote, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    author = quote.author_name

    session.delete(quote)
    session.commit()
    return {
        "ok": True,
        "deleted_author": author,
        "deleted_id": quote_id
    }



