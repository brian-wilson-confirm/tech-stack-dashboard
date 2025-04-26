from sqlmodel import SQLModel, Field
from typing import Optional

"""
    LEVELS
"""
class Level(SQLModel, table=True):
    __tablename__ = "level"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
