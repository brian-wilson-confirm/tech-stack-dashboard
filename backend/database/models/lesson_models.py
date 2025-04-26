from sqlmodel import Field, SQLModel
from typing import List, Optional

"""
    LESSONS
"""
class Lesson(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    lesson_id: str
    title: str
    description: Optional[str]
    content: Optional[str]
    order: Optional[int]
    estimated_duration: Optional[int]
    module_id: Optional[int] = Field(foreign_key="module.id")
    course_id: Optional[int] = Field(foreign_key="course.id")
    level_id: Optional[int] = Field(foreign_key="level.id")
    resource_id: Optional[int] = Field(foreign_key="source.id")



"""
    TASK DEPENDENCIES
"""
class Module(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    order: Optional[int]
    estimated_duration: Optional[int]
    course_id: Optional[int] = Field(foreign_key="course.id")
    level_id: Optional[int] = Field(foreign_key="level.id")
    resource_id: Optional[int] = Field(foreign_key="resource.id")


class Resource(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    url: Optional[str]
    resourcetype_id: Optional[int] = Field(foreign_key="resourcetype.id")
    source_id: Optional[int] = Field(foreign_key="source.id")



"""
    DEPENDENCY RELATIONSHIPS
"""
