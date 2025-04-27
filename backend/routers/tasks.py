import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException

from sqlmodel import Session, select
from sqlalchemy import func
from backend.database.connection import get_session

from backend.database.models.lesson_models import Lesson
from backend.database.models.source_models import Source
from backend.database.models.level_models import Level
from backend.database.models.category_models import Category
from backend.database.models.subcategory_models import Subcategory
from backend.database.models.technology_models import Technology
from backend.database.models.task_models import TaskTopicLink, Task, TaskPriority, TaskStatus, TaskType, TechnologyWithSubcatAndCat
from backend.database.models.topic_models import Topic
from backend.database.views.task_schemas import QuickAddTaskRequest, TaskCreate, TaskRead, TaskResponse, TaskUpdate
from backend.database.views.technology_schemas import TechnologyCreate, TechnologyRead
from sqlalchemy import text

from backend.routers.lessons import enrich_lesson, get_lesson_id
from backend.routers.levels import get_level_id
from backend.routers.people import get_person_ids
from backend.routers.resources import get_resource_id, get_resourcetype_id
from backend.routers.topics import get_topic_ids
from backend.routers.sources import create_source_authors, get_source_id, get_sourcetype_id
from backend.utils.web_scraper_util import extract_article_metadata

router = APIRouter(prefix="/tasks")

"""
    GET Operations
"""
@router.get("/", response_model=List[TaskRead])
async def get_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(select(Task)).all()
    return [serialize_task(task, session) for task in tasks]


@router.get("/count", response_model=int)
async def get_num_tasks(session: Session = Depends(get_session)):
    """Get the total number of tasks in the database."""
    return session.exec(select(func.count()).select_from(Task)).one()




"""
    POST Operations
"""
@router.post("/", response_model=Task)
async def create_task_with_topics(task_in: TaskCreate, session: Session = Depends(get_session)):
    # Get/Create the topic id(s) for the task
    topic_ids = get_topic_ids(task_in.topics, session)

    # Create the task
    task = create_task(task_in, session)

    # Link the task to the topic(s)
    for topic_id in topic_ids:
        session.add(TaskTopicLink(task_id=task.id, topic_id=topic_id))
    
    session.commit()
    return task


@router.post("/from-url", response_model=TaskResponse)
async def create_task_from_url(request: QuickAddTaskRequest, session: Session = Depends(get_session)):
    """Quick Add Task: Create a task from a URL (Source -> Resource -> Lesson -> Task)"""

    # Scrape the HTML at the URL
    url_metadata = extract_article_metadata(request.url)

    # Get/Create the Person id(s)
    person_ids = get_person_ids(url_metadata["authors"], session)

    # Get/Create the Source id
    sourcetype_id = get_sourcetype_id(url_metadata["sourcetype"], session)
    # Get/Create the Source
    source_id = get_source_id(url_metadata["source"], session)

    # Create the source_author relationship(s) if it doesn't already exist
    create_source_authors(source_id, person_ids, session)

    # Get/Create the ResourceType id
    resourcetype_id = get_resourcetype_id(url_metadata["resourcetype"], session)

    # Get/Create the Resource
    resource_id = get_resource_id(resourcetype_id, source_id, url_metadata["resourcetitle"], url_metadata["resourcedescription"], url_metadata["resourceurl"], session)

    # Get the Level
    level_id = get_level_id(url_metadata["lessonlevel"], session)

    # Get/Create the Lesson
    lesson_id = get_lesson_id(url_metadata["lessontitle"], url_metadata["lessondescription"], url_metadata["content"], level_id, resource_id, session)

    # Categorize the Lesson: Technology, Subcategory, Category
    enrich_lesson(lesson_id, session)


    return TaskResponse(
        title=url_metadata["title"],
        url=request.url,
        notes=request.notes
    )


"""
    PUT Operations
"""
@router.put("/{id}", response_model=TaskRead)
async def update_task(id: int, task_update: TaskUpdate, session: Session = Depends(get_session)):
    print(f"id: {id}")
    task = session.exec(
        select(Task).where(Task.id == id)
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Map of field names to their corresponding model classes and new field names
    model_mappings = {
        "priority": (TaskPriority, "priority_id"),
        "status": (TaskStatus, "status_id"),
        "type": (TaskType, "type_id"),
        "level": (Level, "level_id"),
        "technology": (Technology, "technology_id"),
        "category": (Category, "category_id"),
        "subcategory": (Subcategory, "subcategory_id"),
        "source": (Source, "source_id"),
    }

    updates = {}
    for field, value in task_update.model_dump(exclude_unset=True).items():
        print(f"field: {field}, value: {value}")
        if field == "topics":
            value = session.exec(select(Topic).where(Topic.name.in_(value))).all()
            updates[field] = value
        #elif field == "section":
        #    resp = session.exec(select(Section).where(Section.name == value)).first()
        #    if not resp:
        #        # Create a new section since it doesn't exist
        #        print(f"Creating new section: {value}")
        #        new_section = Section(name=value)
        #        session.add(new_section)
        #        session.commit()
        #        session.refresh(new_section)
        #        resp = new_section
        #    updates["section_id"] = resp.id
        elif field in model_mappings:
            model_class, id_field = model_mappings[field]
            # Look up the ID for the string value
            print(f"model_class: {model_class}, id_field: {id_field}, value: {value}")
            result = session.exec(
                select(model_class).where(model_class.name == value)
            ).first()
            if result is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid {field} value: {value}"
                )
            updates[id_field] = result.id
        else:
            updates[field] = value

    # Apply all updates at once
    for field, value in updates.items():
        setattr(task, field, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    
    # ❗️Return a transformed response matching TaskRead structure
    return serialize_task(task, session)




"""
    DELETE Operations
"""
@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: str, session: Session = Depends(get_session)):
    task = session.exec(
        select(Task).where(Task.task_id == task_id)
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Delete task topics first
    session.exec(
        select(TaskTopicLink).where(TaskTopicLink.task_id == task.id)
    ).delete()
    
    # Delete the task
    session.delete(task)
    session.commit()









"""
    Task Priority: CRUD operations
"""

@router.get("/priorities", response_model=List[TaskPriority])
async def get_task_priorities(session: Session = Depends(get_session)):
    return session.exec(select(TaskPriority)).all()





"""
    Task Status: CRUD operations
"""

@router.get("/statuses", response_model=List[TaskStatus])
async def get_task_statuses(session: Session = Depends(get_session)):
    return session.exec(select(TaskStatus)).all()





"""
    Task Type: CRUD operations
"""

@router.get("/types", response_model=List[TaskType])
async def get_task_types(session: Session = Depends(get_session)):
    return session.exec(select(TaskType)).all()





"""
    Task Level: CRUD operations
"""

@router.get("/levels", response_model=List[Level])
async def get_levels(session: Session = Depends(get_session)):
    return session.exec(select(Level)).all()





"""
    Task Source: CRUD operations
"""

@router.get("/sources", response_model=List[Source])
async def get_task_sources(session: Session = Depends(get_session)):
    return session.exec(select(Source)).all()





"""
    Task Category: CRUD operations: CAN BE DELETED, SEE CATEGORIES ROUTER
"""
@router.get("/categories", response_model=List[Category])
async def get_task_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()





"""
    Task Subcategory: CRUD operations
"""

@router.get("/subcategories/{category_id}", response_model=List[Subcategory])
async def get_task_subcategories_by_category(category_id: int, session: Session = Depends(get_session)):
    return session.exec(select(Subcategory).where(Subcategory.category_id == category_id)).all()





"""
    Task Technology: CRUD operations
"""

@router.post("/technologies", response_model=Technology)
async def create_technology(technology: TechnologyCreate, session: Session = Depends(get_session)):
    print(f"technology: {technology.name}, subcategory_id: {technology.subcategory_id}")
    existing = session.exec(
        select(Technology).where(Technology.name == technology.name)
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Technology \"{technology.name}\" already exists"
        )

    new_tech = Technology(name=technology.name, subcategory_id=technology.subcategory_id)
    session.add(new_tech)
    session.commit()
    session.refresh(new_tech)

    #return new_tech
    session.add(TechnologySubcategory(technology_id=new_tech.id, subcategory_id=technology.subcategory_id))
    session.commit()
    return new_tech


@router.get("/technologies", response_model=List[TechnologyRead])
async def get_task_technologies(session: Session = Depends(get_session)):
    statement = (
        select(
            Technology.id.label("id"),
            Technology.name.label("technology"),
            Subcategory.name.label("subcategory"),
            Category.name.label("category"),
        )
        .join(TechnologySubcategory, Technology.id == TechnologySubcategory.technology_id)
        .join(Subcategory, TechnologySubcategory.subcategory_id == Subcategory.id)
        .join(Category, Subcategory.category_id == Category.id)
        .order_by(Technology.name, Category.name, Subcategory.name)
    )

    results = session.exec(statement).all()

    # Each result is a tuple of (technology, subcategory, category), so convert to dicts
    return [
        TechnologyRead(
            id=id,
            name=tech, 
            subcategory=sub, 
            category=cat
        )
        for id, tech, sub, cat in results
    ]


@router.get("/technologies/{subcategory_id}", response_model=List[Technology])
async def get_task_technologies_by_subcategory(subcategory_id: int, session: Session = Depends(get_session)):
    statement = (
        select(Technology)
        .join(TechnologySubcategory, Technology.id == TechnologySubcategory.technology_id)
        .where(TechnologySubcategory.subcategory_id == subcategory_id)
    )
    results = session.exec(statement).all()
    return results


# Used for Category pages
@router.get("/technologies/by-subcategory-name/{subcategory_name}", response_model=List[Technology])
async def get_task_technologies_by_subcategory_name(subcategory_name: str, session: Session = Depends(get_session)):
    # First, find the subcategory ID using LIKE for partial matches
    subcategory = session.exec(
        select(Subcategory)
        .where(Subcategory.name.ilike(f"%{subcategory_name}%"))
    ).first()
    
    if not subcategory:
        raise HTTPException(
            status_code=404,
            detail=f"No subcategory found matching: {subcategory_name}"
        )
    
    # Then use the subcategory_id to get technologies
    statement = (
        select(Technology)
        .join(TechnologySubcategory, Technology.id == TechnologySubcategory.technology_id)
        .where(TechnologySubcategory.subcategory_id == subcategory.id)
    )
    
    results = session.exec(statement).all()
    return results


@router.get("/technologiesInDetail", response_model=List[TechnologyWithSubcatAndCat])
async def get_technologies_with_subcategory_and_category(session: Session = Depends(get_session)):
    query = text("""
        SELECT t.name AS technology,
               sc.name AS subcategory,
               c.name AS category,
               t.description
        FROM technology t
        JOIN technology_subcategory ts ON t.id = ts.technology_id
        JOIN subcategory sc ON ts.subcategory_id = sc.id
        JOIN category c ON sc.category_id = c.id
        ORDER BY t.name, c.name, sc.name;
    """)
    rows = session.exec(query).mappings().all()
    #rows = results.all()
    return [TechnologyWithSubcatAndCat(**row) for row in rows]





"""
    Helper functions
"""

def serialize_task(task: Task, session: Session) -> TaskRead:
    return TaskRead(
            id=task.id,
            task_id=task.task_id,
            task=task.task,
            description=task.description,
            lesson=(lesson := session.get(Lesson, task.lesson_id)) and lesson.title,
            type=(typ := session.get(TaskType, task.type_id)) and typ.name,
            status=(stat := session.get(TaskStatus, task.status_id)) and stat.name,
            priority=(prio := session.get(TaskPriority, task.priority_id)) and prio.name,
            progress=task.progress,
            order=task.order,
            due_date=task.due_date,
            start_date=task.start_date,
            end_date=task.end_date,
            estimated_duration=task.estimated_duration,
            actual_duration=task.actual_duration,
            done=task.done
        )


def create_task(task_in: TaskCreate, session: Session = Depends(get_session)):
    task_data = task_in.model_dump(exclude={"topics"})  # ⬅️ This prevents the validation error
    task_data["task_id"] = generate_unique_task_id(session)
    task = Task(**task_data)  # ✅ Only valid fields passed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def generate_unique_task_id(session, prefix="TASK-", digits=4, max_attempts=10):
    for _ in range(max_attempts):
        random_digits = f"{random.randint(0, 10**digits - 1):0{digits}}"
        task_id = f"{prefix}{random_digits}"
        exists = session.exec(select(Task).where(Task.task_id == task_id)).first()
        if not exists:
            return task_id
    raise ValueError("Failed to generate unique task_id after multiple attempts")