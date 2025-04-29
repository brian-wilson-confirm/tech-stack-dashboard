from sqlmodel import Field, SQLModel
from typing import List, Optional

"""
    COURSES
"""
class Course(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    level_id: Optional[int] = Field(foreign_key="level.id")
    resource_id: Optional[int] = Field(foreign_key="resource.id")
    #estimated_duration: Optional[int]


"""
    COURSE CATEGORIES
"""
class CourseCategory(SQLModel, table=True):
    __tablename__ = "course_category"

    #id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="course.id", primary_key=True)
    category_id: int = Field(foreign_key="category.id", primary_key=True)




"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
