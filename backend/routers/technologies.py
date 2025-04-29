from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.technology_models import Technology, TechnologySubcategory

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


def create_technology_subcategories(technology_id: int, subcategory_ids: List[int], session: Session):
    for subcategory_id in subcategory_ids:
        # Check if the lesson_technology relationship already exists
        existing_relation = session.exec(
            select(TechnologySubcategory).where(
                TechnologySubcategory.technology_id == technology_id,
                TechnologySubcategory.subcategory_id == subcategory_id
            )
        ).first()
        
        # If the relationship doesn't exist, create it
        if not existing_relation:
            create_technology_subcategory(technology_id, subcategory_id, session)


def create_technology_subcategory(technology_id: int, subcategory_id: int, session: Session):
    technology_subcategory = TechnologySubcategory(technology_id=technology_id, subcategory_id=subcategory_id)
    session.add(technology_subcategory)
    session.commit()
    session.refresh(technology_subcategory)
    return technology_subcategory