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
    USER_PROMPT = get_user_prompt(internal_summary)
    
    #return internal_summary
    return submit_prompt(SYSTEM_PROMPT, USER_PROMPT, ResponseType.TEXT)




"""
    HELPER FUNCTIONS
"""
def get_internal_summary():
    return {
        "date": get_date(),
        "cumulative_metrics": "",   #get_cumulative_metrics()
        "daily_metrics": {
            "totals": get_daily_metric_totals(),
            "by_tasks": {
                "by_level": get_daily_metrics_by_level(),
                "by_type": get_daily_metrics_by_type(),
                "by_category": get_daily_metrics_by_category(),
            },
        },
        "settings": get_settings(),
        "user_feedback": "There are no study activities reported for today because the LMS MVP is still under development."
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


def get_daily_metric_totals():
    return {
        "total_study_time_minutes": 0,
        "total_tasks_completed": 0,
        #"total_lessons_completed": 0,
        #"total_modules_completed": 0,
        #"total_courses_completed": 0,
        #"total_resources_accessed": 0,
        #"total_quizzes_completed": 0,
        #"total_debugs_completed": 0,
        #"total_challenges_completed": 0,
    }


def get_daily_metrics_by_level():
    return {
        "beginner": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "intermediate": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "advanced": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "expert": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "unknown": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        }
    }


def get_daily_metrics_by_type():
    return {
        "reading": {
            "total_tasks_completed": 0,
            "total_read_time_minutes": 0
        },
        "watching": {
            "total_tasks_completed": 0,
            "total_watch_time_minutes": 0
        },
        "listening": {
            "total_tasks_completed": 0,
            "total_listen_time_minutes": 0
        },
        "coding": {
            "total_code_time_minutes": 0,
            "total_tasks_completed": 0,
            "challenge_score_percent": []
        },
        "reviewing": {
            "total_tasks_completed": 0,
            "total_review_time_minutes": 0,
        },
        "building": {
            "total_tasks_completed": 0,
            "total_build_time_minutes": 0
        },
        "researching": {
            "total_tasks_completed": 0,
            "total_research_time_minutes": 0
        },
        "installing": {
            "total_tasks_completed": 0,
            "total_install_time_minutes": 0
        },
        "debugging": {
            "total_debug_time_minutes": 0,
            "total_tasks_completed": 0,
            "debug_score_percent": []
        },
        "assessing": {
            "total_assess_time_minutes": 0,
            "total_tasks_completed": 0,
            "assess_score_percent": []
        },
    }


def get_daily_metrics_by_category():
    return {
        "Frontend": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Middleware": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Backend": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Database": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Messaging": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "DevOps": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Security": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Monitoring": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "Dev Tooling": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        },
        "AI/ML": {
            "total_tasks_completed": 0,
            "total_study_time_minutes": 0,
            "quiz_score_percent": [],
            "debug_score_percent": [],
            "challenge_score_percent": []
        }
    }


