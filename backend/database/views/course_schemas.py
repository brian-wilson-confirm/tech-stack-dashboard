from pydantic import BaseModel
from typing import Optional

from backend.database.views.resource_schemas import ResourceRead


"""
    COURSES
"""
class CourseBase(BaseModel):
    title: str
    description: Optional[str]


class CourseCreate(CourseBase):
    level_id: Optional[int]
    resource_id: Optional[int]


class CourseRead(CourseBase):
    id: int
    level: Optional[str] = None
    resource: Optional[str] = None

    
class CourseUpdate(CourseCreate):
    id: int


"""
    COURSE DETAILS
"""
class CourseDetailsRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    level: Optional[str]
    resource: Optional[ResourceRead]