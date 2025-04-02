from typing import Optional, List
from sqlmodel import SQLModel
from datetime import date

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