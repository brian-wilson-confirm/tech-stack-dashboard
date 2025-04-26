from sqlmodel import SQLModel, Field
from typing import Optional

"""
    TECHNOLOGIES
"""
class Technology(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None



"""
    DEPENDENCY RELATIONSHIPS
"""
class TechnologySubcategory(SQLModel, table=True):
    __tablename__ = "technology_subcategory"

    id: Optional[int] = Field(default=None, primary_key=True)
    technology_id: int = Field(foreign_key="technology.id")
    subcategory_id: int = Field(foreign_key="subcategory.id")