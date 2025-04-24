from pydantic import BaseModel
from typing import Optional

from backend.database.views.source_schemas import SourceRead


"""
    RESOURCES
"""



"""
    RESOURCE DETAILS
"""
class ResourceDetailsRead(BaseModel):
    id: int
    title: str
    url: Optional[str]
    resource_type: Optional[str]
    source: Optional[SourceRead]

