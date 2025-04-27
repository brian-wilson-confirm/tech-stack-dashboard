from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List

from backend.database.models.task_models import TaskTopicLink
from backend.database.models.lesson_models import LessonTopic
from backend.database.models.task_models import TaskOld

"""
    TOPICS
"""
class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tasks: List[TaskOld] = Relationship(back_populates="topics", link_model=TaskTopicLink)
    lesson_topics: List[LessonTopic] = Relationship(back_populates="topic")



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""