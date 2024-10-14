from typing import TYPE_CHECKING

from app.models.quotes import Quotes
from pydantic import BaseModel

from tortoise.contrib.pydantic import PydanticModel, pydantic_model_creator

if TYPE_CHECKING:
    class QuoteIn_Pydantic(Quotes, PydanticModel):
        pass

    class Quote_Pydantic(Quotes, PydanticModel):
        pass

else:
    Quote_Pydantic = pydantic_model_creator(Quotes, name="Quote")
    QuoteIn_Pydantic = pydantic_model_creator(Quotes, name="QuoteIn", exclude_readonly=True)


class Status(BaseModel):
    message: str

