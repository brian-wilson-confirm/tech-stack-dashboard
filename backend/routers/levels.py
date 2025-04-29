from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.level_models import Level
from backend.database.views.level_schemas import LevelRead

router = APIRouter(prefix="/levels")

"""
    GET Operations
"""
@router.get("/", response_model=List[LevelRead])
async def get_levels(session: Session = Depends(get_session)):
    levels = session.exec(select(Level)).all()
    return [serialize_level(level, session) for level in levels]



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
def serialize_level(level: Level, session: Session) -> LevelRead:
    return LevelRead(
            id=level.id,
            name=level.name
            )

def get_level_id(level_name: str, session: Session):
    level = session.exec(select(Level).where(Level.name == level_name)).first()
    if not level:
        level = session.exec(select(Level).where(Level.name == "unknown")).first()
    return level.id