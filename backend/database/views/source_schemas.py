from pydantic import BaseModel
from typing import Optional

"""
    SOURCES
"""
class SourceBase(BaseModel):
    id: int
    name: str
    source_type: Optional[str]
    website: Optional[str]


class SourceRead(SourceBase):
    pass

