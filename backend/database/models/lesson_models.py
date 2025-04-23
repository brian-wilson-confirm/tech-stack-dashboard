from datetime import date
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
    level_id: Optional[int] = Field(foreign_key="task_level.id")
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
    level_id: Optional[int] = Field(foreign_key="task_level.id")
    resource_id: Optional[int] = Field(foreign_key="resource.id")


class Course(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    level_id: Optional[int] = Field(foreign_key="task_level.id")
    resource_id: Optional[int] = Field(foreign_key="resource.id")
    #estimated_duration: Optional[int]


class Source(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    source_type_id: Optional[int] = Field(foreign_key="source_type.id")
    website: Optional[str]


class Resource(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    url: Optional[str]
    resource_type_id: Optional[int] = Field(foreign_key="resource_type.id")
    source_id: Optional[int] = Field(foreign_key="source.id")



"""
    DEPENDENCY RELATIONSHIPS
"""
