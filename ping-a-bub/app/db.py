# ping-a-bub/app/db.py


import os


TORTOISE_ORM = {
    "connections": {"default": os.environ.get("DATABASE_URL")},
    "apps": {
        "models": {
            "models": ["app.models.quotes", "aerich.models"],
            "default_connection": "default",
        },
    },
}

