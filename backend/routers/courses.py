from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from backend.database.connection import get_session
from backend.database.models.course_models import Course, CourseCategory
from backend.database.models.lesson_models import Resource, Source
from backend.database.models.resourcetype_models import ResourceType
from backend.database.models.sourcetype_models import SourceType
from backend.database.models.task_models import TaskLevel, Category
from backend.database.views.course_schemas import CourseDetailsRead, CourseRead
from backend.database.views.llm_schemas import LLMResponseModel
from backend.database.views.resource_schemas import ResourceRead
from backend.database.views.source_schemas import SourceRead
import json


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


@router.get("/count", response_model=int)
async def get_num_courses(session: Session = Depends(get_session)):
    """Get the total number of courses in the database."""
    return session.exec(select(func.count()).select_from(Course)).one()


@router.put("/categories")
async def update_course_categories(payload: LLMResponseModel, session: Session = Depends(get_session)):
    """Update course categories based on LLM analysis results."""
    try:
        # Parse the JSON response
        response_data = json.loads(payload.llm_response)
        
        # Process each course in the response
        for course_data in response_data.get("courses", []):
            course_title = course_data.get("course")
            
            # Find the course in the database
            course = session.exec(
                select(Course).where(Course.title == course_title)
            ).first()
            
            if not course:
                continue  # Skip if course not found
            
            # Process each category for the course
            for category_data in course_data.get("categories", []):
                category_name = category_data.get("category")
                
                # Find the category in the database
                category = session.exec(
                    select(Category).where(Category.name == category_name)
                ).first()
                
                if not category:
                    continue  # Skip if category not found
                
                # Check if the course-category relationship already exists
                existing_relation = session.exec(
                    select(CourseCategory).where(
                        CourseCategory.course_id == course.id,
                        CourseCategory.category_id == category.id
                    )
                ).first()
                
                # If the relationship doesn't exist, create it
                if not existing_relation:
                    new_relation = CourseCategory(
                        course_id=course.id,
                        category_id=category.id
                    )
                    session.add(new_relation)
        
        # Commit all changes
        session.commit()
        return {"message": "Course categories updated successfully"}
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON response")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
        resource=ResourceRead(
            id=resource.id,
            title=resource.title,
            description=resource.description,
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