from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from backend.database.models.lesson_models import LessonTechnology

"""
    TECHNOLOGIES
"""
class Technology(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None

    lesson_technologies: List[LessonTechnology] = Relationship(back_populates="technology")

"""
    DEPENDENCY RELATIONSHIPS
"""
class TechnologySubcategory(SQLModel, table=True):
    __tablename__ = "technology_subcategory"

    id: Optional[int] = Field(default=None, primary_key=True)
    technology_id: int = Field(foreign_key="technology.id")
    subcategory_id: int = Field(foreign_key="subcategory.id")