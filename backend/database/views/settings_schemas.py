from pydantic import BaseModel
from typing import Optional


class StudyTime(BaseModel):
    daily_goal: int
    weekly_goal: int
    days_to_study: list[str]
    preferred_hours: Optional[str] = None


class TaskQuotas(BaseModel):
    tasks_per_day: int
    tasks_per_week: int
    task_type_values: dict[str, int]


class QuizGoals(BaseModel):
    quizzes_per_week: int
    daily_quiz_goal: int
    minimum_passing_score: int
    review_missed_topics_weekly: bool


class DifficultyTarget(BaseModel):
    difficulty_range: list[str]
    difficulty_bias: str
    min_tasks_per_level: dict[str, int]
    