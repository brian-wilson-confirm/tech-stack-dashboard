from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.subcategory_models import Subcategory

router = APIRouter(prefix="/subcategories")

"""
    GET Operations
"""
@router.get("/", response_model=List[Subcategory])
async def get_task_subcategories(session: Session = Depends(get_session)):
    return session.exec(select(Subcategory)).all()




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
def get_subcategory_id(subcategory_name: str, session: Session):
    """Get the subcategory id for a given subcategory name."""
    subcategory = session.exec(select(Subcategory).where(Subcategory.name == subcategory_name)).first()
    if not subcategory:
        raise HTTPException(status_code=404, detail=f"Subcategory with name {subcategory_name} not found")
    return subcategory.id

