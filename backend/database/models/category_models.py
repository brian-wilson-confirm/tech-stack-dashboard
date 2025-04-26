from sqlmodel import SQLModel, Field
from typing import Optional

"""
    CATEGORIES
"""
class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
