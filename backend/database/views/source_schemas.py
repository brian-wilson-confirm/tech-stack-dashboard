from pydantic import BaseModel
from typing import Optional

"""
    SOURCES
"""
class SourceRead(BaseModel):
    id: int
    name: str
    source_type: Optional[str]
    website: Optional[str]


"""
    SOURCE DETAILS
"""
