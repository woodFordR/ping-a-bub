from tortoise import fields, models


class Quotes(models.Model):
    """
    The Quote model
    """

    id = fields.IntField(primary_key=True)
    author_name = fields.CharField(max_length=50, default="Anonymous")
    category = fields.CharField(max_length=30, default="other")
    text = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)

    def data_str(self) -> str:
        return f"category::{self.category}, author::{self.author_name}, date::{self.created_at}".strip()
    
    class PydanticMeta:
        computed = ["data_str"]

