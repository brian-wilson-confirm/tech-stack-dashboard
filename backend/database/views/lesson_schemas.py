from pydantic import BaseModel
from typing import List, Optional

from backend.database.views.resource_schemas import ResourceRequest
from backend.database.views.technology_schemas import TechnologyRead
from backend.database.views.category_schemas import CategoryRead
from backend.database.views.subcategory_schemas import SubcategoryRead
from backend.database.views.topic_schemas import TopicRead

"""
    LESSONS
"""
class LessonBase(BaseModel):
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



"""
    LESSON REQUEST
"""
class LessonRequest(BaseModel):
    title: str
    description: Optional[str]
    resource: ResourceRequest


"""
    LESSON DETAILS
"""
class LessonDetailsRead(BaseModel):
    id: int
    lesson_id: str
    title: str
    description: Optional[str]
    technologies: Optional[List[TechnologyRead]]
    subcategories: List[SubcategoryRead]
    categories: List[CategoryRead]
    topics: Optional[List[TopicRead]]
    content: Optional[str]
    order: Optional[int]
    estimated_duration: Optional[int]
    module: Optional[str] = None
    course: Optional[str] = None
    level: Optional[str] = None
    resource: Optional[str] = None