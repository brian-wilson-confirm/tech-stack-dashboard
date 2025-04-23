from datetime import date
from sqlmodel import Field, Relationship, SQLModel
from typing import List, Optional

"""
    LESSONS
"""
class Lesson(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    lesson_id: str
    title: str
    description: Optional[str]
    module_id: Optional[int] = Field(foreign_key="module.id")
    content: Optional[str]
    video_url: Optional[str]
    order: Optional[int]
    estimated_duration: Optional[int]



"""
    TASK DEPENDENCIES
"""
class Module(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    course_id: Optional[int] = Field(foreign_key="course.id")
    order: Optional[int]
    estimated_duration: Optional[int]


class Course(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    author: Optional[str]
    description: Optional[str]
    level_id: Optional[int] = Field(foreign_key="task_level.id")
    source_id: Optional[int] = Field(foreign_key="source.id")
    #estimated_duration: Optional[int]



"""
    DEPENDENCY RELATIONSHIPS
"""
