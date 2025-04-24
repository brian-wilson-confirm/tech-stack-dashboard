from sqlmodel import Field, SQLModel
from typing import List, Optional

"""
    SOURCE TYPES
"""
class SourceType(SQLModel, table=True):
    __tablename__ = "source_type"

    id: int = Field(default=None, primary_key=True)
    name: str



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
