"""FastAPI application entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.features.thoughts.routes import router as thoughts_router

app = FastAPI(title="Affinity Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(thoughts_router)


@app.get("/")
def root():
    return {"message": "Affinity backend is running"}