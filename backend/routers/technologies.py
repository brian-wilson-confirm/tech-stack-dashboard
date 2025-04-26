from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.technology_models import Technology

router = APIRouter(prefix="/technologies")

"""
    GET Operations
"""
@router.get("/", response_model=List[Technology])
async def get_technologies(session: Session = Depends(get_session)):
    return session.exec(select(Technology)).all()




"""
    POST Operations
"""




"""
    PUT Operations
"""



"""
    DELETE Operations
"""





"""
    Helper functions
"""
def get_technology_id(technology_name: str, session: Session):
    """Get the technology id for a given technology name."""
    technology = session.exec(select(Technology).where(Technology.name == technology_name)).first()
    if not technology:
        technology = create_technology(technology_name, session)
    return technology.id


def create_technology(technology_name: str, session: Session):
    technology = Technology(name=technology_name)
    session.add(technology)
    session.commit()
    session.refresh(technology)
    return technology