from sqlmodel import SQLModel
from typing import Optional

class LessonBase(SQLModel):
    title: str
    description: Optional[str]
    content: Optional[str]
    order: Optional[int]
    estimated_duration: Optional[int]


class LessonCreate(LessonBase):
    module_id: Optional[int]
    course_id: Optional[int]
    level_id: Optional[int]
    resource_id: Optional[int]


class LessonRead(LessonBase):
    id: int
    lesson_id: str
    module: Optional[str] = None
    course: Optional[str] = None
    level: Optional[str] = None
    resource: Optional[str] = None

    
class LessonUpdate(LessonCreate):
    id: int
    lesson_id: str