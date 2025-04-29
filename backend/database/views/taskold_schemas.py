from typing import List, Optional
from datetime import date
from sqlmodel import SQLModel


class TaskOldBase(SQLModel):
    task: str
    description: Optional[str] = None
    topics: List[str]
    section: Optional[str] = None
    progress: int
    order: Optional[int]
    due_date: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False


# Actively using 4/18
class TaskOldCreate(TaskOldBase):
    technology_id: int
    subcategory_id: int
    category_id: int
    source_id: int
    level_id: int
    type_id: int
    status_id: int
    priority_id: int


# Actively using 4/21
class TaskOldRead(TaskOldBase):
    id: int
    task_id: str
    technology: str
    subcategory: str
    category: str
    source: str
    level: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class TaskOldUpdate(TaskOldCreate):
    id: int
    task_id: str