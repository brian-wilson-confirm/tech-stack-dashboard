from fastapi import APIRouter
from datetime import datetime
from backend.routers.settings import get_study_time, get_task_quotas, get_quiz_goals, get_difficulty_targets, get_category_balance
from backend.database.connection import get_session

router = APIRouter(prefix="/summary")


"""
    GET Operations
"""
@router.get("/")
async def get_summary():
    print("Getting summary")
    return {
        "date": get_date(),
        "cumulative_metrics": get_cumulative_metrics(),
        "daily_metrics": get_daily_metrics(),
        "recent_updates": get_recent_updates(),
        "settings": get_settings()
    }


def get_date():
    return datetime.now().strftime("%Y-%m-%d")


def get_cumulative_metrics():
    return {
        "total_tasks": 10,
        "total_topics": 5,
        "total_lessons": 20,
        "total_courses": 3,
        "total_people": 15,
    }


def get_daily_metrics():
    return {
        "total_tasks": 10,
        "total_topics": 5,
        "total_lessons": 20,
        "total_courses": 3,
        "total_people": 15,
    }


def get_recent_updates():
    return {
        "tasks": [
            {
                "id": 1,
                "title": "Task 1",
                "description": "Description 1",
                "status": "Completed",
                "due_date": "2025-05-07",
            },
        ],
    }


def get_settings():
    session = next(get_session())
    return {
        "learning_goals": {
            "study_time": get_study_time(session),
            "task_quotas": get_task_quotas(session),
            "quiz_goals": get_quiz_goals(session),
            "difficulty_targets": get_difficulty_targets(session),
            "category_balance": get_category_balance(session),
        },
    }
