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
def get_topic_ids(topic_names: List[str], session: Session = Depends(get_session)):
    return [get_topic_id(topic_name, session) for topic_name in topic_names]


def get_topic_id(topic_name: str, session: Session):
    """Get the topic id for a given topic name."""
    topic = session.exec(select(Topic).where(Topic.name == topic_name)).first()
    if not topic:
        topic = create_topic(topic_name, session)
    return topic.id


def create_topic(topic_name: str, session: Session):
    topic = Topic(name=topic_name)
    session.add(topic)
    session.commit()
    session.refresh(topic)
    return topic