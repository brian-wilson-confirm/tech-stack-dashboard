from pydantic import BaseModel
from typing import Optional

"""
    SOURCES
"""
class SourceBase(BaseModel):
    name: str
    sourcetype: Optional[str]
    website: Optional[str]


class SourceCreate(SourceBase):
    pass


class SourceRead(SourceBase):
    id: int

