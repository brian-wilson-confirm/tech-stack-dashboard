from sqlmodel import SQLModel, Field
from typing import Optional

"""
    SUBCATEGORIES
"""
class Subcategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_id: int



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
