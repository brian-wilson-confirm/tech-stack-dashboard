from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, TYPE_CHECKING
from backend.database.models.lesson_models import LessonCategory


if TYPE_CHECKING:
    from backend.database.models.subcategory_models import Subcategory

"""
    CATEGORIES
"""
class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    lesson_categories: List[LessonCategory] = Relationship(back_populates="category")
    subcategories: List["Subcategory"] = Relationship(back_populates="category")


"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
