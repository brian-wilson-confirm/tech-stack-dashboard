import random
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.course_models import Course
from backend.database.models.lesson_models import Lesson, Module, Resource
from backend.database.models.level_models import Level
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
            level=(lvl := session.get(Level, lesson.level_id)) and lvl.name,
            resource=(res := session.get(Resource, lesson.resource_id)) and res.title,
            content=lesson.content,
            order=lesson.order,
            estimated_duration=lesson.estimated_duration
        )


def create_lesson(title: str, description: str, content: str, level_id: int, resource_id: int, session: Session):
    lesson_id = generate_unique_lesson_id(session)
    new_lesson = Lesson(lesson_id=lesson_id, title=title, description=description, content=content, level_id=level_id, resource_id=resource_id)
    session.add(new_lesson)
    session.commit()
    session.refresh(new_lesson)
    return new_lesson


def get_lesson_id(title: str, description: str, content: str, level_id: int, resource_id: int, session: Session):
    lesson = session.exec(select(Lesson)
                            .where(Lesson.title == title)
                            .where(Lesson.resource_id == resource_id)).first()
    if not lesson:
        lesson = create_lesson(title, description, content, level_id, resource_id, session)
    return lesson.id


def generate_unique_lesson_id(session, prefix="LESSON-", digits=4, max_attempts=10):
    for _ in range(max_attempts):
        random_digits = f"{random.randint(0, 10**digits - 1):0{digits}}"
        lesson_id = f"{prefix}{random_digits}"
        exists = session.exec(select(Lesson).where(Lesson.lesson_id == lesson_id)).first()
        if not exists:
            return lesson_id
    raise ValueError("Failed to generate unique lesson_id after multiple attempts")