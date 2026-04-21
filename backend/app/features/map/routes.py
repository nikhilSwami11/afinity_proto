"""Map routes."""
from fastapi import APIRouter, Depends, Request
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.map import service
from app.features.map.schemas import PositionRequest, PositionResponse, SeedUser

router = APIRouter(prefix="/map", tags=["Map"])


def get_model(request: Request) -> SentenceTransformer:
    return request.app.state.embedding_model


@router.get("/users", response_model=list[SeedUser])
def get_map_users(db: Session = Depends(get_db)):
    """Return all seed users with their 2D positions."""
    return service.get_all_seed_users(db)


@router.post("/position", response_model=PositionResponse)
def get_position(
    payload: PositionRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Embed the user's onboarding answers and return their (x, y) position
    on the map, computed as the weighted centroid of K=3 nearest seed users.
    """
    model = get_model(request)
    result = service.compute_position(db, model, payload.onboarding_answers)
    return PositionResponse(**result)
