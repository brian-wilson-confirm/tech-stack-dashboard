from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from backend.database.models.lesson_models import LessonSubcategory


if TYPE_CHECKING:
    from backend.database.models.category_models import Category

"""
    SUBCATEGORIES
"""
class Subcategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    category_id: int = Field(foreign_key="category.id")

    lesson_subcategories: List[LessonSubcategory] = Relationship(back_populates="subcategory")
    category: Optional["Category"] = Relationship(back_populates="subcategories")



"""
    TASK DEPENDENCIES
"""




"""
    DEPENDENCY RELATIONSHIPS
"""
