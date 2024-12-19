# bubster_backend/main

from logging import basicConfig
from datetime import datetime
import logfire
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from bubster_backend import settings
import bubster_backend.health.router as health
import bubster_backend.quotes.router as quotes
import bubster_backend.users.router as users


origins = [
    "http://localhost",
    "http://localhost:5173"
]

def config_routing_operation_ids(app: FastAPI) -> None:
    for route in app.routes:
        if isinstance(route, APIRoute):
            route.operation_id = f"{route.name}-{datetime.now().strftime("%m%d%y-%H:%M")}"


def create_application() -> FastAPI:
    app = FastAPI(debug=settings.debug)
    logfire.configure(
        service_name="bubster_backend"
    )
    logfire.instrument_asyncpg()

    # standard log sink
    basicConfig(handlers=[logfire.LogfireLoggingHandler()])

    # adding routes
    app.include_router(health.router)
    app.include_router(quotes.router)
    app.include_router(users.router)
    config_routing_operation_ids(app)

    # enable cors
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_application()


