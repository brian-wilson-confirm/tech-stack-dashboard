from sqlmodel import Field, SQLModel
from typing import List, Optional

"""
    COURSES
"""
class Course(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    level_id: Optional[int] = Field(foreign_key="task_level.id")
    resource_id: Optional[int] = Field(foreign_key="resource.id")
    #estimated_duration: Optional[int]



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
