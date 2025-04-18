from datetime import date
from sqlmodel import Field, Relationship, SQLModel
from typing import List, Optional

"""
    TASKS
"""
class TaskTopicLink(SQLModel, table=True):
    __tablename__ = "task_topic"

    task_id: Optional[int] = Field(default=None, foreign_key="task.id", primary_key=True)
    topic_id: Optional[int] = Field(default=None, foreign_key="topic.id", primary_key=True)


# Actively using 4/18
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: str
    task: str
    description: str
    technology_id: int = Field(foreign_key="technology.id")
    subcategory_id: int = Field(foreign_key="subcategory.id")
    category_id: int = Field(foreign_key="category.id")
    section_id: int = Field(foreign_key="section.id")
    source_id: int = Field(foreign_key="source.id")
    topics: List["Topic"] = Relationship(back_populates="tasks", link_model=TaskTopicLink)
    level_id: int = Field(foreign_key="task_level.id")
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
class Technology(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    
class Subcategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_id: int

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tasks: List["Task"] = Relationship(back_populates="topics", link_model=TaskTopicLink)

class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class Source(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class TaskLevel(SQLModel, table=True):
    __tablename__ = "task_level"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class TaskType(SQLModel, table=True):
    __tablename__ = "task_type"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class TaskStatus(SQLModel, table=True):
    __tablename__ = "task_status"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class TaskPriority(SQLModel, table=True):
    __tablename__ = "task_priority"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str


"""
    DEPENDENCY RELATIONSHIPS
"""
class TechnologySubcategory(SQLModel, table=True):
    __tablename__ = "technology_subcategory"

    id: Optional[int] = Field(default=None, primary_key=True)
    technology_id: int = Field(foreign_key="technology.id")
    subcategory_id: int = Field(foreign_key="subcategory.id")

class TechnologyWithSubcatAndCat(SQLModel, table=False):  # table=False since it's a view or raw query result
    technology: str
    subcategory: str
    category: str
    description: Optional[str] = None