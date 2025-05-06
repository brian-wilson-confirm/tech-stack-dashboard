from sqlmodel import SQLModel, Field
from typing import Optional

class StudyDay(SQLModel, table=True):
    __tablename__ = "study_days"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    day_of_week: str  # 'Mon', 'Tue', etc.
    is_set: bool = Field(default=False)
