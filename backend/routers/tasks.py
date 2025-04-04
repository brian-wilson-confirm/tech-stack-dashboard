from typing import List
from fastapi import APIRouter, Depends, HTTPException

from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from backend.database.connection import get_session

from backend.database.models.task_models import TaskTopicLink, Task, Category, Section, Source, Subcategory, Technology, TaskLevel, TaskPriority, TaskStatus, TaskType, TechnologySubcategory, Topic
from backend.database.views.task_schemas import TaskCreate, TaskRead, TaskUpdate

router = APIRouter(prefix="/tasks")

"""
    Task: CRUD operations
"""

@router.post("/", response_model=Task)
async def create_task(task_in: TaskCreate, session: Session = Depends(get_session)):
    task = Task.model_validate(task_in)
    session.add(task)
    session.commit()
    session.refresh(task)

    for topic_id in task_in.topic_ids:
        session.add(TaskTopicLink(task_id=task.id, topic_id=topic_id))
    
    session.commit()
    return task


@router.get("/", response_model=List[TaskRead])
async def get_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).options(selectinload(Task.topics))
    ).all()
    
    result = []
    for task in tasks:
        result.append(serialize_task(task, session))
    
    return result


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
        "level": (TaskLevel, "level_id"),
        "technology": (Technology, "technology_id"),
        "category": (Category, "category_id"),
        "subcategory": (Subcategory, "subcategory_id"),
        "section": (Section, "section_id"),
        "source": (Source, "source_id"),
    }

    updates = {}
    for field, value in task_update.model_dump(exclude_unset=True).items():
        print(f"field: {field}, value: {value}")
        if field == "topics":
            value = session.exec(select(Topic).where(Topic.name.in_(value))).all()
            updates[field] = value
        elif field == "section":
            print(f"section: {value}")
            resp = session.exec(select(Section).where(Section.name == value)).first()
            if not resp:
                # Create a new section since it doesn't exist
                print(f"Creating new section: {value}")
                new_section = Section(name=value)
                session.add(new_section)
                session.commit()
                session.refresh(new_section)
                resp = new_section
                #print(f"new_section: {value}")
            updates["section_id"] = resp.id
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

@router.get("/levels", response_model=List[TaskLevel])
async def get_task_levels(session: Session = Depends(get_session)):
    return session.exec(select(TaskLevel)).all()

"""
    Task Source: CRUD operations
"""

@router.get("/sources", response_model=List[Source])
async def get_task_sources(session: Session = Depends(get_session)):
    return session.exec(select(Source)).all()

"""
    Task Category: CRUD operations
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

@router.get("/technologies/{subcategory_id}", response_model=List[Technology])
async def get_task_technologies_by_subcategory(subcategory_id: int, session: Session = Depends(get_session)):
    statement = (
        select(Technology)
        .join(TechnologySubcategory, Technology.id == TechnologySubcategory.technology_id)
        .where(TechnologySubcategory.subcategory_id == subcategory_id)
    )
    results = session.exec(statement).all()
    return results








"""
    Helper functions
"""

def serialize_task(task: Task, session: Session) -> TaskRead:
    return TaskRead(
            id=task.id,
            task_id=task.task_id,
            task=task.task,
            technology=session.get(Technology, task.technology_id).name,
            subcategory=(sub := session.get(Subcategory, task.subcategory_id)) and sub.name,
            category=(cat := session.get(Category, task.category_id)) and cat.name,
            section=(sec := session.get(Section, task.section_id)) and sec.name,
            source=(src := session.get(Source, task.source_id)) and src.name,
            level=(lvl := session.get(TaskLevel, task.level_id)) and lvl.name,
            type=(typ := session.get(TaskType, task.type_id)) and typ.name,
            status=(stat := session.get(TaskStatus, task.status_id)) and stat.name,
            priority=(prio := session.get(TaskPriority, task.priority_id)) and prio.name,
            progress=task.progress,
            order=task.order,
            #due_date=task.due_date,
            start_date=task.start_date,
            end_date=task.end_date,
            estimated_duration=task.estimated_duration,
            actual_duration=task.actual_duration,
            done=task.done,
            topics=[t.name for t in task.topics]
        )