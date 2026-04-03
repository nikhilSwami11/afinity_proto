"""Thought service layer."""
from sqlalchemy.orm import Session

from app.features.thoughts.repository import ThoughtRepository
from app.features.thoughts.schemas import ThoughtCreate, ThoughtUpdate


class ThoughtService:
    def __init__(self):
        self.repo = ThoughtRepository()

    def create_thought(self, db: Session, user_id: int, payload: ThoughtCreate):
        return self.repo.create(
            db,
            user_id=user_id,
            content=payload.content,
            status=payload.status,
            visibility=payload.visibility,
            prompt_source=payload.prompt_source,
        )

    def get_thought(self, db: Session, thought_id: int):
        return self.repo.get_by_id(db, thought_id)

    def list_user_thoughts(self, db: Session, user_id: int):
        return self.repo.list_by_user(db, user_id)

    def update_thought(self, db: Session, thought, payload: ThoughtUpdate):
        update_data = payload.model_dump(exclude_unset=True)
        return self.repo.update(db, thought, **update_data)

    def delete_thought(self, db: Session, thought):
        self.repo.delete(db, thought)