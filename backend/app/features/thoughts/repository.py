"""Thought repository layer."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.features.thoughts.models import Thought


class ThoughtRepository:
    def create(self, db: Session, **kwargs) -> Thought:
        thought = Thought(**kwargs)
        db.add(thought)
        db.commit()
        db.refresh(thought)
        return thought

    def get_by_id(self, db: Session, thought_id: int) -> Thought | None:
        stmt = select(Thought).where(Thought.id == thought_id)
        return db.scalar(stmt)

    def list_by_user(self, db: Session, user_id: int) -> list[Thought]:
        stmt = (
            select(Thought)
            .where(Thought.user_id == user_id)
            .order_by(Thought.created_at.desc())
        )
        return list(db.scalars(stmt).all())

    def update(self, db: Session, thought: Thought, **kwargs) -> Thought:
        for key, value in kwargs.items():
            setattr(thought, key, value)
        db.commit()
        db.refresh(thought)
        return thought

    def delete(self, db: Session, thought: Thought) -> None:
        db.delete(thought)
        db.commit()