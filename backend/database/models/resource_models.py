from sqlmodel import SQLModel, Field
from typing import Optional

"""
    RESOURCES
"""
class Resource(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    resourcetype_id: Optional[int] = Field(foreign_key="resourcetype.id")
    url: Optional[str]
    source_id: Optional[int] = Field(foreign_key="source.id")