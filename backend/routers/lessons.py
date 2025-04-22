from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.lesson_models import Lesson

router = APIRouter(prefix="/lessons")

"""
    Lesson: CRUD operations
"""

@router.get("/", response_model=List[Lesson])
async def get_lessons(session: Session = Depends(get_session)):
    return session.exec(select(Lesson)).all()


"""
    Helper functions
"""
def create_lesson(lesson_name: str, session: Session = Depends(get_session)):
    new_lesson = Lesson(name=lesson_name)
    session.add(new_lesson)
    session.commit()
    session.refresh(new_lesson)
    return new_lesson