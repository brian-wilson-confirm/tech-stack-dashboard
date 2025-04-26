from pydantic import BaseModel
from typing import Optional

from backend.database.views.source_schemas import SourceRead


"""
    RESOURCES
"""
class ResourceBase(BaseModel):
    title: str
    description: Optional[str]
    url: Optional[str]
    resourcetype: Optional[str]
    source: Optional[SourceRead]


class ResourceCreate(ResourceBase):
    pass


class ResourceRead(ResourceBase):
    id: int

