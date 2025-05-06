from sqlmodel import SQLModel, Field
from typing import Optional

class StudyDay(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    day_of_week: str  # 'Mon', 'Tue', etc.
