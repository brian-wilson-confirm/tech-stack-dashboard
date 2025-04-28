from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from backend.database.models.lesson_models import Lesson

if TYPE_CHECKING:
    from backend.database.models.lesson_models import Lesson

"""
    LEVELS
"""
class Level(SQLModel, table=True):
    __tablename__ = "level"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    lessons: List["Lesson"] = Relationship(back_populates="level")