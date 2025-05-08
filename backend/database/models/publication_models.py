from sqlmodel import SQLModel, Field
from typing import Optional

"""
    PUBLICATIONS
"""
class Publication(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    source_id: int = Field(foreign_key="source.id")


"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""