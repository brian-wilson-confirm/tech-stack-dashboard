from fastapi import APIRouter, Depends
from backend.database.views.settings_schemas import StudyTime
from backend.database.connection import get_session
from sqlmodel import Session
from backend.database.models.goals.learning_goals import LearningGoals


router = APIRouter(prefix="/settings")


"""
    GET ENDPOINTS
"""

@router.get("/")
async def get_settings():
    return {"message": "Hello, World!"}


"""
    POST ENDPOINTS
"""




"""
    PUT ENDPOINTS
"""

@router.put("/study-time", response_model=StudyTime)
async def update_study_time(study_time: StudyTime, session: Session = Depends(get_session)):
    # For now, assume a single row with id=1
    goals = session.get(LearningGoals, 1)
    if not goals:
        goals = LearningGoals(id=1)
        session.add(goals)
    goals.daily_study_hours = study_time.daily_goal
    goals.weekly_study_hours = study_time.weekly_goal
    session.commit()
    session.refresh(goals)
    return study_time


"""
    HELPER FUNCTIONS
"""