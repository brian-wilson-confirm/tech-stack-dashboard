from sqlmodel import SQLModel, Field
from typing import Optional

class CategoryPreference(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="category.id")
    target_percentage: int = Field(ge=0, le=100)
    min_subcategories: int = 0
