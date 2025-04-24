from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.course_models import Course
from backend.database.models.lesson_models import Lesson, Module, Resource
from backend.database.models.task_models import TaskLevel
from backend.database.views.lesson_schemas import LessonRead


router = APIRouter(prefix="/lessons")

"""
    Lesson: CRUD operations
"""

@router.get("/", response_model=List[LessonRead])
async def get_lessons(session: Session = Depends(get_session)):
    lessons = session.exec(select(Lesson)).all()
    return [serialize_lesson(lesson, session) for lesson in lessons]


@router.get("/count", response_model=int)
async def get_num_lessons(session: Session = Depends(get_session)):
    """Get the total number of lessons in the database."""
    return session.exec(select(func.count()).select_from(Lesson)).one()



"""
    Helper functions
"""
def serialize_lesson(lesson: Lesson, session: Session) -> LessonRead:
    return LessonRead(
            id=lesson.id,
            lesson_id=lesson.lesson_id,
            title=lesson.title,
            description=lesson.description,
            module=(mod := session.get(Module, lesson.module_id)) and mod.title,
            course=(
                module := session.get(Module, lesson.module_id)
            ) and (
                course := session.get(Course, module.course_id)
            ) and course.title,
            level=(lvl := session.get(TaskLevel, lesson.level_id)) and lvl.name,
            resource=(res := session.get(Resource, lesson.resource_id)) and res.title,
            content=lesson.content,
            order=lesson.order,
            estimated_duration=lesson.estimated_duration
        )


def create_lesson(lesson_name: str, session: Session = Depends(get_session)):
    new_lesson = Lesson(name=lesson_name)
    session.add(new_lesson)
    session.commit()
    session.refresh(new_lesson)
    return new_lesson