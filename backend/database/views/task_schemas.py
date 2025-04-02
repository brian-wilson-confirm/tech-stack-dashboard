from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from backend.database.models.task_models import TaskLevel, TaskType, TaskPriority, TaskStatus

class Task(BaseModel):
    id: str
    done: bool
    task: str
    technology: str
    subcategory: str
    category: str
    section: str
    estimated_duration: int  # in hours
    topics: List[str]
    level: TaskLevel
    type: TaskType
    priority: TaskPriority
    order: int
    status: TaskStatus
    progress: int  # percentage
    source: str
    start_date: Optional[date]
    end_date: Optional[date]
    actual_duration: Optional[int]  # in hours
    # due_date

class TaskCreate(BaseModel):
    task: str
    technology_id: int
    subcategory_id: int
    section_id: int
    source_id: int
    estimated_duration: Optional[int]
    level: str
    type: str
    priority: str
    status: str
    progress: int = 0
    done: bool = False
    order: Optional[int]
    start_date: Optional[date]
    end_date: Optional[date]
    actual_duration: Optional[int]
    topic_ids: List[int]

class TasksResponse(BaseModel):
    tasks: List[Task]


"""
class TaskCreate(BaseModel):
    task: str
    technology: str
    subcategory: str
    category: str
    order: int
    status: str
    progress: int
    priority: str
    type: str
    level: str
    section: str
    topics: List[str]
    source: str
    estimated_duration: int
    actual_duration: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
"""