from datetime import date
from sqlmodel import Field, Relationship, SQLModel
from typing import List, Optional

"""
    LESSONS
"""
class Lesson(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
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



"""
    DEPENDENCY RELATIONSHIPS
"""
