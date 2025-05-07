from fastapi import APIRouter, Depends
from backend.database.models.category_models import Category
from backend.database.models.goals.category_preferences import CategoryPreference
from backend.database.models.goals.category_settings import CategorySettings
from backend.database.models.goals.difficulty_preferences import DifficultyPreferences
from backend.database.models.goals.study_days import StudyDay
from backend.database.models.goals.study_hours import StudyHour
from backend.database.models.goals.task_type_weights import TaskTypeWeight
from backend.database.views.settings_schemas import CategoryBalance, DifficultyTarget, QuizGoals, StudyTime, TaskQuotas
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
        task_type_values=task_type_values
    )


@router.get("/learning-goals/quiz-goals", response_model=QuizGoals)
async def get_quiz_goals(session: Session = Depends(get_session)):
    goals = session.get(LearningGoals, 1)
    return QuizGoals(
        daily_quiz_goal=goals.daily_quiz_goal if goals else None,
        quizzes_per_week=goals.quizzes_per_week if goals else None,
        minimum_passing_score=goals.minimum_passing_score if goals else None,
        review_missed_topics_weekly=goals.review_missed_topics_weekly if goals else None
    )


@router.get("/learning-goals/difficulty-targets", response_model=DifficultyTarget)
async def get_difficulty_targets(session: Session = Depends(get_session)):
    preferences = session.get(DifficultyPreferences, 1)
    difficulty_range = []
    if preferences.allow_beginner:
        difficulty_range.append("Beginner")
    if preferences.allow_intermediate:
        difficulty_range.append("Intermediate")
    if preferences.allow_advanced:
        difficulty_range.append("Advanced")
    if preferences.allow_expert:
        difficulty_range.append("Expert")

    return DifficultyTarget(
        difficulty_range=difficulty_range,
        difficulty_bias=preferences.bias if preferences else "balanced",
        min_tasks_per_level={
            "Beginner": preferences.min_beginner_tasks if preferences else 0,
            "Intermediate": preferences.min_intermediate_tasks if preferences else 0,
            "Advanced": preferences.min_advanced_tasks if preferences else 0,
            "Expert": preferences.min_expert_tasks if preferences else 0
        }   
    )


@router.get("/learning-goals/category-balance", response_model=CategoryBalance)
async def get_category_balance(session: Session = Depends(get_session)):
    # Get all categories and build id->name and name->id maps
    categories = session.exec(select(Category)).all()
    id_to_name = {cat.id: cat.name for cat in categories}

    # Get all category preferences
    category_preferences = session.exec(select(CategoryPreference)).all()
    target_category_distribution = {}
    min_subcategories_per_category = {}
    for cp in category_preferences:
        name = id_to_name.get(cp.category_id)
        if name:
            target_category_distribution[name] = cp.target_percentage
            min_subcategories_per_category[name] = cp.min_subcategories

    # Get category settings
    category_settings = session.get(CategorySettings, 1)
    enforce_balance = category_settings.enforce_balance if category_settings else False
    auto_alert_on_imbalance = category_settings.auto_alert_on_imbalance if category_settings else False

    return CategoryBalance(
        target_category_distribution=target_category_distribution,
        enforce_balance=enforce_balance,
        min_subcategories_per_category=min_subcategories_per_category,
        auto_alert_on_imbalance=auto_alert_on_imbalance,
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


@router.put("/learning-goals/quiz-goals")
async def update_quiz_goals(quiz_goals: QuizGoals, session: Session = Depends(get_session)):
    update_learning_goals(quiz_goals, session)  


@router.put("/learning-goals/difficulty-targets")
async def update_difficulty_targets(difficulty_targets: DifficultyTarget, session: Session = Depends(get_session)):
    update_difficulty_preferences(difficulty_targets, session)


@router.put("/learning-goals/category-balance")
async def update_category_balance(category_balance: CategoryBalance, session: Session = Depends(get_session)):
    update_category_preferences(category_balance, session)
    update_category_settings(category_balance, session)











"""
    HELPER FUNCTIONS
"""
def update_learning_goals(tab: StudyTime | TaskQuotas | QuizGoals, session: Session):
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
    elif isinstance(tab, QuizGoals):
        goals.daily_quiz_goal = tab.daily_quiz_goal
        goals.quizzes_per_week = tab.quizzes_per_week
        goals.minimum_passing_score = tab.minimum_passing_score
        goals.review_missed_topics_weekly = tab.review_missed_topics_weekly
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


def update_difficulty_preferences(difficulty_targets: DifficultyTarget, session: Session):
    """
    Update the difficulty preferences based on the difficulty targets.
    """
    # For now, assume a single row with id=1
    preferences = session.get(DifficultyPreferences, 1)
    if not preferences:
        preferences = DifficultyPreferences(id=1)
        session.add(preferences)

    preferences.allow_beginner = "Beginner" in difficulty_targets.difficulty_range
    preferences.allow_intermediate = "Intermediate" in difficulty_targets.difficulty_range
    preferences.allow_advanced = "Advanced" in difficulty_targets.difficulty_range
    preferences.allow_expert = "Expert" in difficulty_targets.difficulty_range
    preferences.bias = difficulty_targets.difficulty_bias
    preferences.min_beginner_tasks = difficulty_targets.min_tasks_per_level.get("Beginner", 0)
    preferences.min_intermediate_tasks = difficulty_targets.min_tasks_per_level.get("Intermediate", 0)
    preferences.min_advanced_tasks = difficulty_targets.min_tasks_per_level.get("Advanced", 0)
    preferences.min_expert_tasks = difficulty_targets.min_tasks_per_level.get("Expert", 0)
    session.commit()


def update_category_preferences(category_balance: CategoryBalance, session: Session):
    """
    Update the category preferences based on the category balance.
    """
    # Build a mapping from category name to id
    name_to_id = {cat.name: cat.id for cat in session.exec(select(Category)).all()}

    # Update target_percentage for each category
    for category_name, target_percentage in category_balance.target_category_distribution.items():
        category_id = name_to_id.get(category_name)
        if category_id is not None:
            cp = session.exec(select(CategoryPreference).where(CategoryPreference.category_id == category_id)).first()
            if cp:
                cp.target_percentage = target_percentage

    # Update min_subcategories for each category
    for category_name, min_subcategories in category_balance.min_subcategories_per_category.items():
        category_id = name_to_id.get(category_name)
        if category_id is not None:
            cp = session.exec(select(CategoryPreference).where(CategoryPreference.category_id == category_id)).first()
            if cp:
                cp.min_subcategories = min_subcategories
    session.commit()


def update_category_settings(category_balance: CategoryBalance, session: Session):
    """
    Update the category settings based on the category balance.
    """
    category_settings = session.get(CategorySettings, 1)
    if not category_settings:
        category_settings = CategorySettings(id=1)
        session.add(category_settings)  

    category_settings.enforce_balance = category_balance.enforce_balance
    category_settings.auto_alert_on_imbalance = category_balance.auto_alert_on_imbalance
    session.commit()