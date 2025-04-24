from sqlmodel import Field, SQLModel
from typing import List, Optional

"""
    RESOURCE TYPES
"""
class ResourceType(SQLModel, table=True):
    __tablename__ = "resource_type"

    id: int = Field(default=None, primary_key=True)
    name: str



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
