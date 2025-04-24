from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.course_models import Course
from backend.database.models.lesson_models import Resource, Source
from backend.database.models.resource_type_models import ResourceType
from backend.database.models.source_type_models import SourceType
from backend.database.models.task_models import TaskLevel
from backend.database.views.course_schemas import CourseDetailsRead, CourseRead
from backend.database.views.resource_schemas import ResourceDetailsRead
from backend.database.views.source_schemas import SourceRead


router = APIRouter(prefix="/courses")

"""
    Course: CRUD operations
"""
@router.get("/", response_model=List[CourseRead])
async def get_courses(session: Session = Depends(get_session)):
    courses = session.exec(select(Course)).all()
    return [serialize_course(course, session) for course in courses]


@router.get("/{course_id}/details", response_model=CourseDetailsRead)
async def get_course_details(course_id: int, session: Session = Depends(get_session)):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Load related models
    level = session.get(TaskLevel, course.level_id) if course.level_id else None
    resource = session.get(Resource, course.resource_id) if course.resource_id else None
    source = session.get(Source, resource.source_id) if resource and resource.source_id else None

    return serialize_course_details(course, level, resource, source, session)



"""
    Helper functions
"""
def serialize_course(course: Course, session: Session) -> CourseRead:
    return CourseRead(
            id=course.id,
            title=course.title,
            description=course.description,
            level=(lvl := session.get(TaskLevel, course.level_id)) and lvl.name,
            resource=(res := session.get(Resource, course.resource_id)) and res.title
        )


def serialize_course_details(course: Course, level: TaskLevel, resource: Resource, source: Source, session: Session) -> CourseDetailsRead:
    return CourseDetailsRead(
        id=course.id,
        title=course.title,
        description=course.description,
        level=level.name if level else None,
        resource=ResourceDetailsRead(
            id=resource.id,
            title=resource.title,
            url=resource.url,
            resource_type=(rt := session.get(ResourceType, resource.resource_type_id)) and rt.name,
            source=SourceRead(
                id=source.id,
                name=source.name,
                website=source.website,
                source_type=(st := session.get(SourceType, source.source_type_id)) and st.name
            ) if source else None
        ) if resource else None
    )




def create_course(course_name: str, session: Session = Depends(get_session)):
    new_course = Course(name=course_name)
    session.add(new_course)
    session.commit()
    session.refresh(new_course)
    return new_course