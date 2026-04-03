"""Thought routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.features.thoughts.schemas import ThoughtCreate, ThoughtResponse, ThoughtUpdate
from app.features.thoughts.service import ThoughtService

router = APIRouter(prefix="/thoughts", tags=["Thoughts"])
service = ThoughtService()


def get_current_user():
    # temporary stub until auth is built
    return {"id": 1}


@router.post("", response_model=ThoughtResponse, status_code=status.HTTP_201_CREATED)
def create_thought(
    payload: ThoughtCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return service.create_thought(db, user_id=current_user["id"], payload=payload)


@router.get("/me", response_model=list[ThoughtResponse])
def list_my_thoughts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return service.list_user_thoughts(db, user_id=current_user["id"])


@router.get("/{thought_id}", response_model=ThoughtResponse)
def get_thought(
    thought_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    thought = service.get_thought(db, thought_id)
    if not thought:
        raise HTTPException(status_code=404, detail="Thought not found")

    if thought.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    return thought


@router.patch("/{thought_id}", response_model=ThoughtResponse)
def update_thought(
    thought_id: int,
    payload: ThoughtUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    thought = service.get_thought(db, thought_id)
    if not thought:
        raise HTTPException(status_code=404, detail="Thought not found")

    if thought.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    return service.update_thought(db, thought, payload)


@router.delete("/{thought_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_thought(
    thought_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    thought = service.get_thought(db, thought_id)
    if not thought:
        raise HTTPException(status_code=404, detail="Thought not found")

    if thought.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    service.delete_thought(db, thought)
    return None