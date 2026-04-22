"""Map routes."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.features.map import service
from app.features.map.schemas import PositionRequest, PositionResponse, SeedUser
from app.features.users.models import User

router = APIRouter(prefix="/map", tags=["Map"])


def get_model(request: Request) -> SentenceTransformer:
    return request.app.state.embedding_model


@router.get("/users", response_model=list[SeedUser])
def get_map_users(db: Session = Depends(get_db)):
    return service.get_all_seed_users(db)


@router.post("/position", response_model=PositionResponse)
def get_position(
    payload: PositionRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    model = get_model(request)
    result = service.compute_position(db, model, payload.onboarding_answers)
    return PositionResponse(**result)


@router.post("/recalculate", response_model=PositionResponse)
def recalculate_position(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model = get_model(request)
    result = service.recalculate_position_from_thoughts(db, model, current_user.id)
    if result is None:
        raise HTTPException(status_code=400, detail="No published thoughts to compute position from.")
    return PositionResponse(**result)
