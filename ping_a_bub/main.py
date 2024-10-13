# ping_a_bub/main.py


from fastapi import FastAPI, Depends
from ping_a_bub.config import get_settings, Settings


app = FastAPI()

@app.get("/ping")
def pong(settings: Settings = Depends(get_settings)):
    return {
        "ping": "pong!",
        "ënvironment": settings.environment,
        "testing": settings.testing    
    }

