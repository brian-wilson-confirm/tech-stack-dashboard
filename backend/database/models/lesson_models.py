from sqlmodel import Field, Relationship, SQLModel
from typing import List, Optional, TYPE_CHECKING
from datetime import datetime


if TYPE_CHECKING:
    from backend.database.models.level_models import Level


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
    created_at: datetime = Field(default=datetime.now())

    lesson_technologies: List["LessonTechnology"] = Relationship(back_populates="lesson")
    lesson_subcategories: List["LessonSubcategory"] = Relationship(back_populates="lesson")
    lesson_categories: List["LessonCategory"] = Relationship(back_populates="lesson")
    lesson_topics: List["LessonTopic"] = Relationship(back_populates="lesson")
    #module: Optional["Module"] = Relationship(back_populates="lessons")
    #course: Optional["Course"] = Relationship(back_populates="lessons")
    level: Optional["Level"] = Relationship(back_populates="lessons")
    #resource: Optional["Source"] = Relationship(back_populates="lessons")


"""
    LESSON CATEGORIES
"""
class LessonCategory(SQLModel, table=True):
    __tablename__ = "lesson_category"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    category_id: int = Field(foreign_key="category.id", primary_key=True)

    lesson: "Lesson" = Relationship(back_populates="lesson_categories")
    category: "Category" = Relationship(back_populates="lesson_categories")

"""
    LESSON SUBCATEGORIES
"""
class LessonSubcategory(SQLModel, table=True):
    __tablename__ = "lesson_subcategory"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    subcategory_id: int = Field(foreign_key="subcategory.id", primary_key=True)

    lesson: "Lesson" = Relationship(back_populates="lesson_subcategories")
    subcategory: "Subcategory" = Relationship(back_populates="lesson_subcategories")

"""
    LESSON TECHNOLOGIES
"""
class LessonTechnology(SQLModel, table=True):
    __tablename__ = "lesson_technology"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    technology_id: int = Field(foreign_key="technology.id", primary_key=True)

    lesson: "Lesson" = Relationship(back_populates="lesson_technologies")
    technology: "Technology" = Relationship(back_populates="lesson_technologies")


"""
    LESSON TOPICS
"""
class LessonTopic(SQLModel, table=True):
    __tablename__ = "lesson_topic"

    lesson_id: int = Field(foreign_key="lesson.id", primary_key=True)
    topic_id: int = Field(foreign_key="topic.id", primary_key=True)

    lesson: "Lesson" = Relationship(back_populates="lesson_topics")
    topic: "Topic" = Relationship(back_populates="lesson_topics")


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
