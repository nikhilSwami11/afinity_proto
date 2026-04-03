"""FastAPI application entrypoint."""
from fastapi import FastAPI

from app.features.thoughts.routes import router as thoughts_router

app = FastAPI(title="Affinity Backend")

app.include_router(thoughts_router)


@app.get("/")
def root():
    return {"message": "Affinity backend is running"}