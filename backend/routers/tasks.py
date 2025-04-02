from typing import List
from fastapi import APIRouter, Depends

from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from backend.database.connection import get_session

from backend.database.models.task_models import TaskTopicLink, Task, Category, Section, Source, Subcategory, Technology, TaskLevel, TaskPriority, TaskStatus, TaskType
from backend.database.views.views import TaskView
from backend.database.views.task_schemas import TaskCreate, TasksResponse

router = APIRouter(prefix="/tasks")


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


@router.get("/", response_model=List[TaskView])
async def get_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(
        select(Task).options(selectinload(Task.topics))
    ).all()
    
    result = []
    for task in tasks:
        result.append(TaskView(
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
        ))
    
    return result