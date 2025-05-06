from pydantic import BaseModel
from typing import Optional


class StudyTime(BaseModel):
    daily_goal: int
    weekly_goal: int
    days_to_study: list[str]
    preferred_hours: Optional[str] = None
