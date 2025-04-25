from pydantic import BaseModel
from typing import Optional

from backend.database.views.source_schemas import SourceRead


"""
    RESOURCES
"""
class ResourceBase(BaseModel):
    id: int
    title: str
    description: Optional[str]
    url: Optional[str]
    resource_type: Optional[str]
    source: Optional[SourceRead]


class ResourceRead(ResourceBase):
    pass

