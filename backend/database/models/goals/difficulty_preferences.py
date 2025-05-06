from sqlmodel import SQLModel, Field
from typing import Optional

class DifficultyPreferences(SQLModel, table=True):
    __tablename__ = "difficulty_preferences"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    allow_beginner: bool = False
    allow_intermediate: bool = False
    allow_advanced: bool = False
    bias: str = Field(default="balanced", regex="^(balanced|push_higher|reinforce_basics)$")
    min_beginner_tasks: int = 0
    min_intermediate_tasks: int = 0
    min_advanced_tasks: int = 0
