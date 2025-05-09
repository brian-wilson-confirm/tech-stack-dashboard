from fastapi import APIRouter
from datetime import datetime
from backend.llm.clients.langchain import submit_prompt
from backend.routers.settings import get_study_time, get_task_quotas, get_quiz_goals, get_difficulty_targets, get_category_balance
from backend.database.connection import get_session
from backend.llm.templates.daily_summary_template import get_system_prompt, get_user_prompt
from backend.enums import ResponseType

router = APIRouter(prefix="/summary")


"""
    GET Operations
"""
@router.get("/")
async def get_summary():
    internal_summary = get_internal_summary()

    SYSTEM_PROMPT = get_system_prompt()
    USER_PROMPT = get_user_prompt(get_todays_summary(), get_yesterdays_summary())
    
    return internal_summary
    #return submit_prompt(SYSTEM_PROMPT, USER_PROMPT, ResponseType.TEXT)




"""
    HELPER FUNCTIONS
"""
def get_internal_summary():
    return {
        "date": get_date(),
        "cumulative_metrics": "", #get_cumulative_metrics(),
        "daily_metrics": "", #get_daily_metrics(),
        "recent_updates": "", #get_recent_updates(),
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


def get_todays_summary():
    return {
        "date": "2025-05-07",
        "study_hours_target": 15,
        "tasks_target_per_day": 5,
        "min_expert_tasks": 3,
        "completed_tasks": 4,
        "actual_hours_studied": 2.5,
        "categories": {
            "Frontend": 2,
            "Backend": 1,
            "DevOps": 1
        }
    }


def get_yesterdays_summary():
    return {
        "date": "2025-05-06",
        "study_hours_target": 15,
        "tasks_target_per_day": 5,
        "min_expert_tasks": 3,
        "completed_tasks": 6,
        "actual_hours_studied": 3.0,
        "categories": {
            "Frontend": 3,
            "Backend": 2,
            "Security": 1
        }
    }