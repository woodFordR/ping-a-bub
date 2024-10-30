import logfire
from src.quotes.models import Quote, QuoteCreate, QuotePublic, Status
from fastapi import APIRouter, Depends, Query
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
async def get_quote(quote_id: int):
    return quote_id


@router.put("/{quote_id}", response_model=QuotePublic)
async def update_quote(quote_id: int, quote: QuotePublic):
    # await Quotes.filter(id=quote_id).update(**quote.model_dump(exclude_unset=True))
    return quote_id


@router.delete("/{quote_id}", response_model=Status)
async def delete_quote(quote_id: int):
    # deleted_quote = await Quotes.filter(id=quote_id).delete()
    # if not deleted_quote:
    #    raise HTTPException(status_code=404, detail=f"Quote #{quote_id} not found")
    return Status(message=f"Deleted quote #{quote_id}")

