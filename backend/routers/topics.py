from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.task_models import Topic

router = APIRouter(prefix="/topics")

"""
    Task Source: CRUD operations
"""

@router.get("/", response_model=List[Topic])
async def get_topics(session: Session = Depends(get_session)):
    return session.exec(select(Topic)).all()


"""
    Helper functions
"""
def create_topic(topic_name: str, session: Session = Depends(get_session)):
    new_topic = Topic(name=topic_name)
    session.add(new_topic)
    session.commit()
    session.refresh(new_topic)
    return new_topic

def get_topic_ids(topic_names: List[str], session: Session = Depends(get_session)):
    topic_ids = []
    for topic_name in topic_names:
        topic = session.exec(select(Topic).where(Topic.name == topic_name)).first()
        if not topic:
            topic = create_topic(topic_name, session)
        topic_ids.append(topic.id)
    return topic_ids