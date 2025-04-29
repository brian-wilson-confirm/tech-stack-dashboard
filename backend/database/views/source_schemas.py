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



"""
    SOURCE TYPE REQUEST
"""
class SourceTypeRequest(BaseModel):
    name: str
    


"""
    SOURCE REQUEST
"""
class SourceRequest(BaseModel):
    name: str
    website: Optional[str] = None
    sourcetype: SourceTypeRequest

