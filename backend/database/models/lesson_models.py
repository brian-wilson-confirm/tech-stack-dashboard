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
    LESSON CATEGORIES
"""
class LessonCategory(SQLModel, table=True):
    __tablename__ = "lesson_category"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    category_id: int = Field(foreign_key="category.id", primary_key=True)



"""
    LESSON SUBCATEGORIES
"""
class LessonSubcategory(SQLModel, table=True):
    __tablename__ = "lesson_subcategory"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    subcategory_id: int = Field(foreign_key="subcategory.id", primary_key=True)



"""
    LESSON TECHNOLOGIES
"""
class LessonTechnology(SQLModel, table=True):
    __tablename__ = "lesson_technology"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    technology_id: int = Field(foreign_key="technology.id", primary_key=True)




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
