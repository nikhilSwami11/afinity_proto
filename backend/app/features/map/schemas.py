"""Map schemas."""
from pydantic import BaseModel, Field, field_validator


class SeedUser(BaseModel):
    id: int
    name: str
    excerpt: str
    themes: list[str]
    camp: str
    map_x: float
    map_y: float

    model_config = {"from_attributes": True}


class PositionRequest(BaseModel):
    onboarding_answers: list[str] = Field(..., min_length=1, max_length=5)

    @field_validator("onboarding_answers")
    @classmethod
    def at_least_one_non_empty(cls, answers: list[str]) -> list[str]:
        cleaned = [a.strip() for a in answers]
        if not any(cleaned):
            raise ValueError("At least one answer must be non-empty.")
        return [a[:2000] for a in answers]


class PositionResponse(BaseModel):
    x: float
    y: float
    low_signal: bool = False
