from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.category_models import Category

router = APIRouter(prefix="/categories")

"""
    GET Operations
"""
@router.get("/", response_model=List[Category])
async def get_task_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()




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
def get_category_id(category_name: str, session: Session):
    """Get the category id for a given category name."""
    category = session.exec(select(Category).where(Category.name == category_name)).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Category with name {category_name} not found")
    return category.id

