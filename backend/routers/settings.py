from fastapi import APIRouter, Depends
from backend.database.models.goals.study_days import StudyDay
from backend.database.models.goals.study_hours import StudyHour
from backend.database.models.goals.task_type_weights import TaskTypeWeight
from backend.database.views.settings_schemas import StudyTime, TaskQuotas
from backend.database.connection import get_session
from sqlmodel import Session, select
from backend.database.models.goals.learning_goals import LearningGoals
from backend.database.models.task_models import TaskType


router = APIRouter(prefix="/settings")


"""
    GET ENDPOINTS
"""

@router.get("/learning-goals/study-time", response_model=StudyTime)
async def get_settings(session: Session = Depends(get_session)):
    goals = session.get(LearningGoals, 1)
    hours = session.exec(select(StudyHour).where(StudyHour.id == 1)).first()

    return StudyTime(
        daily_goal=goals.daily_study_hours if goals else None,
        weekly_goal=goals.weekly_study_hours if goals else None,
        days_to_study=[day.day_of_week for day in session.exec(select(StudyDay).where(StudyDay.is_set == True)).all()],
        preferred_hours=hours.label + ", " + hours.time_range if hours else None,
    )


@router.get("/learning-goals/task-quotas", response_model=TaskQuotas)
async def get_task_quotas(session: Session = Depends(get_session)):
    goals = session.get(LearningGoals, 1)
    task_type_weights = session.exec(select(TaskTypeWeight)).all()
    
    task_type_names = {tt.id: tt.name for tt in session.exec(select(TaskType)).all()}
    task_type_values = {
        task_type_names[type_weight.task_type_id]: type_weight.weight
        for type_weight in task_type_weights
        if type_weight.task_type_id in task_type_names
    }

    return TaskQuotas(
        tasks_per_day=goals.tasks_per_day if goals else None,
        tasks_per_week=goals.tasks_per_week if goals else None,
        task_type_values=task_type_values,
        min_completion=getattr(goals, "min_completion", 0),
    )





"""
    POST ENDPOINTS
"""




"""
    PUT ENDPOINTS
"""

@router.put("/learning-goals/study-time")
async def update_study_time(study_time: StudyTime, session: Session = Depends(get_session)):
    update_learning_goals(study_time, session)
    update_study_days(study_time, session)
    update_study_hours(study_time, session)


@router.put("/learning-goals/task-quotas")
async def update_task_quotas(task_quotas: TaskQuotas, session: Session = Depends(get_session)):
    update_learning_goals(task_quotas, session)
    update_task_type_weights(task_quotas, session)






"""
    HELPER FUNCTIONS
"""
def update_learning_goals(tab: StudyTime | TaskQuotas, session: Session):
    """
    Update the learning goals based on the study time.
    """
    # For now, assume a single row with id=1
    goals = session.get(LearningGoals, 1)
    if not goals:
        goals = LearningGoals(id=1)
        session.add(goals)

    if isinstance(tab, StudyTime):
        goals.daily_study_hours = tab.daily_goal
        goals.weekly_study_hours = tab.weekly_goal
    elif isinstance(tab, TaskQuotas):
        goals.tasks_per_day = tab.tasks_per_day
        goals.tasks_per_week = tab.tasks_per_week
        if hasattr(goals, "min_completion"):
            goals.min_completion = tab.min_completion
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


def update_task_type_weights(task_quotas: TaskQuotas, session: Session):
    """
    Update the task type weights based on the task quotas.
    """
    # task_quotas.task_type_values is a dict: {name: weight}
    # Get all TaskType objects and build a name->id map
    task_types = session.exec(select(TaskType)).all()
    name_to_id = {tt.name.lower(): tt.id for tt in task_types}

    # Get all TaskTypeWeight objects
    type_weights = session.exec(select(TaskTypeWeight)).all()
    id_to_weight = {tw.task_type_id: tw for tw in type_weights}

    for name, weight in task_quotas.task_type_values.items():
        task_type_id = name_to_id.get(name.lower())
        if task_type_id and task_type_id in id_to_weight:
            id_to_weight[task_type_id].weight = weight

    session.commit()


