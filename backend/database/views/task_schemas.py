from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel
from datetime import timedelta

from backend.database.views.lesson_schemas import LessonDetailsRead
from backend.database.views.taskstatus_schemas import TaskStatusRead
from backend.database.views.tasktype_schemas import TaskTypeRead
from backend.database.views.taskpriority_schemas import TaskPriorityRead

"""
    TASK
"""
class TaskBase(BaseModel):
    task: str
    description: Optional[str] = None
    progress: int
    order: Optional[int]
    due_date: Optional[date]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    estimated_duration: Optional[timedelta]
    actual_duration: Optional[timedelta]
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


class TaskUpdateStatus(BaseModel):
    status_id: int


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


"""
    TASK DETAILS
"""
class TaskDetailsRead(BaseModel):
    id: int
    task_id: str
    task: str
    description: Optional[str]
    lesson: LessonDetailsRead
    type: TaskTypeRead
    status: TaskStatusRead
    priority: TaskPriorityRead
    progress: int
    order: Optional[int]
    due_date: Optional[date]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    estimated_duration: Optional[timedelta]
    actual_duration: Optional[timedelta]
    done: bool = False


"""
    TASK COUNT BY CATEGORY
"""
class TaskCountByCategory(BaseModel):
    category: str
    tasks: int
