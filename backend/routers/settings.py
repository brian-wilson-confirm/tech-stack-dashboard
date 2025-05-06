from fastapi import APIRouter, Depends
from backend.database.models.goals.study_days import StudyDay
from backend.database.models.goals.study_hours import StudyHour
from backend.database.views.settings_schemas import StudyTime
from backend.database.connection import get_session
from sqlmodel import Session, select
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

@router.put("/study-time")
async def update_study_time(study_time: StudyTime, session: Session = Depends(get_session)):
    update_learning_goals(study_time, session)
    update_study_days(study_time, session)
    update_study_hours(study_time, session)

"""
    HELPER FUNCTIONS
"""
def update_learning_goals(study_time: StudyTime, session: Session):
    """
    Update the learning goals based on the study time.
    """
    # For now, assume a single row with id=1
    goals = session.get(LearningGoals, 1)
    if not goals:
        goals = LearningGoals(id=1)
        session.add(goals)
    goals.daily_study_hours = study_time.daily_goal
    goals.weekly_study_hours = study_time.weekly_goal
    session.commit()


def update_study_days(study_time: StudyTime, session: Session):
    """
    Update the study days based on the study time.
    """
    selected_days = set(day.lower() for day in study_time.days_to_study)
    days = session.exec(select(StudyDay)).all()
    for day in days:
        day.is_set = day.day_of_week.lower() in selected_days
    session.commit()


def update_study_hours(study_time: StudyTime, session: Session):
    """
    Update the study hours based on the study time.
    """
    if not study_time.preferred_hours:
        return

    # Example parsing: "Mornings, 8–10pm" -> label="Mornings", time_range="8–10pm"
    parts = [p.strip() for p in study_time.preferred_hours.split(",")]
    label = parts[0] if parts else None
    time_range = parts[1] if len(parts) > 1 else None

    # Upsert logic: update if exists, else create
    study_hour = session.exec(select(StudyHour).where(StudyHour.id == 1)).first()
    if not study_hour:
        study_hour = StudyHour(id=1)
        session.add(study_hour)
    study_hour.label = label
    study_hour.time_range = time_range
    session.commit()