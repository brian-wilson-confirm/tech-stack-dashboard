from datetime import datetime, date
from sqlmodel import Field, Relationship, SQLModel
from typing import List, Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from backend.database.models.lesson_models import Lesson
    from backend.database.models.task_models import TaskStatus
    from backend.database.models.task_models import TaskType
    from backend.database.models.task_models import TaskPriority
    from backend.database.models.topic_models import Topic

"""
    TASKS
"""
class TaskTopicLink(SQLModel, table=True):
    __tablename__ = "task_topic"

    task_id: Optional[int] = Field(default=None, foreign_key="taskold.id", primary_key=True)
    topic_id: Optional[int] = Field(default=None, foreign_key="topic.id", primary_key=True)


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: str
    task: str
    description: str
    lesson_id: int = Field(foreign_key="lesson.id")
    type_id: int = Field(foreign_key="task_type.id")
    status_id: int = Field(foreign_key="task_status.id")
    priority_id: int = Field(foreign_key="task_priority.id")
    progress: int = 0
    order: Optional[int]
    due_date: Optional[date]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False

    lesson: Optional["Lesson"] = Relationship(back_populates="tasks")
    status: Optional["TaskStatus"] = Relationship(back_populates="tasks")
    type: Optional["TaskType"] = Relationship(back_populates="tasks")
    priority: Optional["TaskPriority"] = Relationship(back_populates="tasks")



class TaskOld(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: str
    task: str
    description: str
    technology_id: int = Field(foreign_key="technology.id")
    subcategory_id: int = Field(foreign_key="subcategory.id")
    category_id: int = Field(foreign_key="category.id")
    section: str
    source_id: int = Field(foreign_key="source.id")
    topics: List["Topic"] = Relationship(back_populates="tasks", link_model=TaskTopicLink)
    level_id: int = Field(foreign_key="level.id")
    type_id: int = Field(foreign_key="task_type.id")
    status_id: int = Field(foreign_key="task_status.id")
    progress: int = 0
    order: Optional[int]
    priority_id: int = Field(foreign_key="task_priority.id")
    due_date: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False




"""
    TASK DEPENDENCIES
""" 

"""
class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
"""


class TaskType(SQLModel, table=True):
    __tablename__ = "task_type"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tasks: List["Task"] = Relationship(back_populates="type")

class TaskStatus(SQLModel, table=True):
    __tablename__ = "task_status"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tasks: List["Task"] = Relationship(back_populates="status")

class TaskPriority(SQLModel, table=True):
    __tablename__ = "task_priority"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tasks: List["Task"] = Relationship(back_populates="priority")


"""
    DEPENDENCY RELATIONSHIPS
"""
class TechnologyWithSubcatAndCat(SQLModel, table=False):  # table=False since it's a view or raw query result
    technology: str
    subcategory: str
    category: str
    description: Optional[str] = None