import logfire

from typing import List
from fastapi import APIRouter, HTTPException
from app.models.quotes import Quotes
from app.schemas import Status, Quote_Pydantic, QuoteIn_Pydantic

router = APIRouter(
    prefix="/quotes"
)
logfire.configure(
    service_name="quotes"
)

@router.get("", response_model=List[Quote_Pydantic])
async def get_quotes():
    return await Quote_Pydantic.from_queryset(Quotes.all())


@router.post("", response_model=Quote_Pydantic)
async def create_quote(quote: QuoteIn_Pydantic):
    quote_obj = await Quotes.create(**quote.model_dump(exclude_unset=True))
    return await Quote_Pydantic.from_tortoise_orm(quote_obj)


@router.get("/{quote_id}", response_model=Quote_Pydantic)
async def get_quote(quote_id: int):
    return await Quote_Pydantic.from_queryset_single(Quotes.get(id=quote_id))


@router.put("/{quote_id}", response_model=Quote_Pydantic)
async def update_quote(quote_id: int, quote: QuoteIn_Pydantic):
    await Quotes.filter(id=quote_id).update(**quote.model_dump(exclude_unset=True))
    return await Quote_Pydantic.from_queryset_single(Quotes.get(id=quote_id))


@router.delete("/{quote_id}", response_model=Status)
async def delete_quote(quote_id: int):
    deleted_quote = await Quotes.filter(id=quote_id).delete()
    if not deleted_quote:
        raise HTTPException(status_code=404, detail=f"Quote #{quote_id} not found")
    return Status(message=f"Deleted quote #{quote_id}")

