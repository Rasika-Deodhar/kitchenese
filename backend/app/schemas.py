from typing import Literal
from pydantic import BaseModel, Field, field_validator

CUISINES = [
    "Indian",
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Thai",
    "Mediterranean",
    "French",
    "American Diner",
    "Surprise me",
]

MODES = ["cook", "eat_out"]


class AnalogyRequest(BaseModel):
    concept: str = Field(..., min_length=1, max_length=120)
    cuisine: str
    mode: Literal["cook", "eat_out"]

    @field_validator("concept")
    @classmethod
    def concept_not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("concept must not be blank")
        return v

    @field_validator("cuisine")
    @classmethod
    def cuisine_whitelisted(cls, v: str) -> str:
        if v not in CUISINES:
            raise ValueError(f"cuisine must be one of {CUISINES}")
        return v


class Ingredient(BaseModel):
    kitchen: str
    tech: str


class AnalogyResponse(BaseModel):
    concept: str
    dish_name: str
    spice_level: int = Field(..., ge=1, le=4)
    one_liner: str
    ingredients: list[Ingredient]
    method: list[str]
    chefs_note: str
    pairs_with: list[str]
