# ping-a-bub/main.py


from fastapi import FastAPI


app = FastAPI()

@app.get("/ping")
def pong():
    return {"ping": "pong!"}

