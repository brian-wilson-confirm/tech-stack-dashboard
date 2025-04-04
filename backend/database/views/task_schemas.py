from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from sqlmodel import SQLModel


class TaskCreate(SQLModel):
    task: str
    technology_id: int
    subcategory_id: int
    category_id: int
    topic_ids: List[int]
    section_id: int
    source_id: int
    level_id: int
    type_id: int
    status_id: int
    priority_id: int
    progress: int = 0
    order: Optional[int]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False


class TaskRead(SQLModel):
    id: int
    task_id: str
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


class TaskUpdate(SQLModel):
    id: int
    task_id: str
    task: str
    technology: str
    subcategory: str
    category: str
    topics: List[str]
    section: str
    source: str
    level_id: int
    type_id: int
    status_id: int
    priority_id: int
    progress: int
    order: Optional[int]
    #due_date: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[int]
    actual_duration: Optional[int]
    done: bool = False