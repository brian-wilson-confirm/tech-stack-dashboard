from typing import List, Optional
from datetime import date
from pydantic import BaseModel
from datetime import timedelta


"""
    TASK
"""
class TaskBase(BaseModel):
    task: str
    description: Optional[str] = None
    progress: int
    order: Optional[int]
    due_date: Optional[date]
    start_date: Optional[date]
    end_date: Optional[date]
    estimated_duration: Optional[timedelta]
    actual_duration: Optional[int]
    done: bool = False


class TaskCreate(TaskBase):
    lesson_id: int
    type_id: int
    status_id: int
    priority_id: int


class TaskRead(TaskBase):
    id: int
    task_id: str
    lesson: str
    type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class TaskUpdate(TaskCreate):
    id: int
    task_id: str


"""
    QUICK ADD TASK
"""
class QuickAddTaskRequest(BaseModel):
    url: str
    notes: str


class TaskResponse(BaseModel):
    title: str
    notes: Optional[str] = None
    url: str