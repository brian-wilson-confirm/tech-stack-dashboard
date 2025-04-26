import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.course_models import Course
from backend.database.models.lesson_models import Lesson, Module, Resource
from backend.database.models.level_models import Level
from backend.database.models.resourcetype_models import ResourceType
from backend.database.models.source_models import Source
from backend.database.models.sourcetype_models import SourceType
from backend.database.models.task_models import Category, Subcategory
from backend.database.views.lesson_schemas import LessonRead, LessonRequest
from backend.database.views.resource_schemas import ResourceRequest, ResourceTypeRequest
from backend.database.views.source_schemas import SourceRequest, SourceTypeRequest
from backend.llm.templates.prompt_templates import build_lesson_prompt
from backend.routers.openai import submit_prompt


router = APIRouter(prefix="/lessons")

"""
    GET Operations
"""
@router.get("/", response_model=List[LessonRead])
async def get_lessons(session: Session = Depends(get_session)):
    lessons = session.exec(select(Lesson)).all()
    return [serialize_lesson(lesson, session) for lesson in lessons]


@router.get("/count", response_model=int)
async def get_num_lessons(session: Session = Depends(get_session)):
    """Get the total number of lessons in the database."""
    return session.exec(select(func.count()).select_from(Lesson)).one()



"""
    Helper functions
"""
def serialize_lesson(lesson: Lesson, session: Session) -> LessonRead:
    return LessonRead(
            id=lesson.id,
            lesson_id=lesson.lesson_id,
            title=lesson.title,
            description=lesson.description,
            module=(mod := session.get(Module, lesson.module_id)) and mod.title,
            course=(
                module := session.get(Module, lesson.module_id)
            ) and (
                course := session.get(Course, module.course_id)
            ) and course.title,
            level=(lvl := session.get(Level, lesson.level_id)) and lvl.name,
            resource=(res := session.get(Resource, lesson.resource_id)) and res.title,
            content=lesson.content,
            order=lesson.order,
            estimated_duration=lesson.estimated_duration
        )


def create_lesson(title: str, description: str, content: str, level_id: int, resource_id: int, session: Session):
    lesson_id = generate_unique_lesson_id(session)
    new_lesson = Lesson(lesson_id=lesson_id, title=title, description=description, content=content, level_id=level_id, resource_id=resource_id)
    session.add(new_lesson)
    session.commit()
    session.refresh(new_lesson)
    return new_lesson


def get_lesson_id(title: str, description: str, content: str, level_id: int, resource_id: int, session: Session):
    lesson = session.exec(select(Lesson)
                            .where(Lesson.title == title)
                            .where(Lesson.resource_id == resource_id)).first()
    if not lesson:
        lesson = create_lesson(title, description, content, level_id, resource_id, session)
    return lesson.id


def generate_unique_lesson_id(session, prefix="LESSON-", digits=4, max_attempts=10):
    for _ in range(max_attempts):
        random_digits = f"{random.randint(0, 10**digits - 1):0{digits}}"
        lesson_id = f"{prefix}{random_digits}"
        exists = session.exec(select(Lesson).where(Lesson.lesson_id == lesson_id)).first()
        if not exists:
            return lesson_id
    raise ValueError("Failed to generate unique lesson_id after multiple attempts")


def categorize_lesson(lesson_id: int, session: Session):
    category_subcategory_map = get_category_subcategory_map(session)
    lesson_details = get_lesson_details(lesson_id, session)

     # Built the prompt
    prompt = build_lesson_prompt(lesson_details, category_subcategory_map)
    response = submit_prompt(prompt)

    return response

def get_category_subcategory_map(session: Session):
    # Get list of categories
    categories = session.exec(select(Category)).all()

    # Create a dictionary to map categories to their subcategories
    category_subcategory_map = {}

    # For every category, get the list of subcategories and add to map
    for category in categories:
        subcategories = session.exec(select(Subcategory).where(Subcategory.category_id == category.id)).all()
        category_subcategory_map[category.name] = [subcategory.name for subcategory in subcategories]

    return category_subcategory_map


def get_lesson_details(lesson_id: int, session: Session):
    lesson = session.get(Lesson, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Load related models
    resource = session.get(Resource, lesson.resource_id) if lesson.resource_id else None
    resourcetype = session.get(ResourceType, resource.resourcetype_id) if resource and resource.resourcetype_id else None
    source = session.get(Source, resource.source_id) if resource and resource.source_id else None
    sourcetype = session.get(SourceType, source.sourcetype_id) if source and source.sourcetype_id else None
    #authors = session.get(SourceAuthor, source.id) if source and source.name == "Author" else None

    return serialize_lesson_details(lesson, resource, resourcetype, source, sourcetype)


def serialize_lesson_details(lesson, resource, resourcetype, source, sourcetype) -> LessonRequest:
    return LessonRequest(
        title=lesson.title,
        description=lesson.description,
        resource=ResourceRequest(
            title=resource.title,
            description=resource.description,
            url=resource.url,
            resourcetype=ResourceTypeRequest(
                name=resourcetype.name),
            source=SourceRequest(
                name=source.name, 
                sourcetype=SourceTypeRequest(
                    name=sourcetype.name
                )
            )
        )
    )

