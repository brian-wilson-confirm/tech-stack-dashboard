from sqlmodel import SQLModel, Field
from typing import Optional

class StudyHour(SQLModel, table=True):
    __tablename__ = "study_hours"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    label: Optional[str]  # e.g. "Mornings"
    time_range: str       # e.g. "8–10pm"
