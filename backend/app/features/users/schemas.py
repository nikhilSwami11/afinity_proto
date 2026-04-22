"""User schemas."""

from pydantic import BaseModel


class MeResponse(BaseModel):
    user_id: int
    username: str
    map_x: float | None
    map_y: float | None


class PositionUpdate(BaseModel):
    x: float
    y: float
