"""FastAPI application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

from app.features.auth.routes import router as auth_router
from app.features.map.routes import router as map_router
from app.features.thoughts.routes import router as thoughts_router
from app.features.users.routes import router as users_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading embedding model...")
    app.state.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Embedding model ready.")
    yield


app = FastAPI(title="Affinity Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(thoughts_router)
app.include_router(map_router, prefix="/api/v1")
app.include_router(users_router)


@app.get("/")
def root():
    return {"message": "Affinity backend is running"}
