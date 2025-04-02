from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import date


"""
class TechStackItem(Base):
    __tablename__ = "tech_stack"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
"""

class TaskTopicLink(SQLModel, table=True):
    __tablename__ = "task_topic"

    task_id: Optional[int] = Field(default=None, foreign_key="task.id", primary_key=True)
    topic_id: Optional[int] = Field(default=None, foreign_key="topic.id", primary_key=True)


class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tasks: List["Task"] = Relationship(back_populates="topics", link_model=TaskTopicLink)


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    task: str
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
    #due_date: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False


class TaskView(SQLModel):
    id: int
    task: str
    technology: str
    subcategory: str
    category: str
    topics: List[str]
    section: str
    source: str
    level: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress: int
    order: Optional[int]
    #due_date: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False

class Subcategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_id: int

class Section(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class Source(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class Technology(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
