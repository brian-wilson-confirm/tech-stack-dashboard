from sqlmodel import SQLModel, Field
from typing import Optional

class LearningGoals(SQLModel, table=True):
    __tablename__ = "learning_goals"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    weekly_study_hours: int = 0
    daily_study_hours: int = 0
    tasks_per_day: int = 0
    tasks_per_week: int = 0
    quizzes_per_week: int = 0
    daily_quiz_goal: int = 0
    minimum_passing_score: int = 80
    review_missed_topics_weekly: bool = False
