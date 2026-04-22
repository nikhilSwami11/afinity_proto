"""User routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.features.users.models import User
from app.features.users.schemas import MeResponse, PositionUpdate

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


@router.get("/me", response_model=MeResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return MeResponse(
        user_id=current_user.id,
        username=current_user.username,
        map_x=current_user.map_x,
        map_y=current_user.map_y,
    )


@router.patch("/me/position", response_model=MeResponse)
def update_position(
    payload: PositionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.map_x = payload.x
    current_user.map_y = payload.y
    db.commit()
    db.refresh(current_user)
    return MeResponse(
        user_id=current_user.id,
        username=current_user.username,
        map_x=current_user.map_x,
        map_y=current_user.map_y,
    )
