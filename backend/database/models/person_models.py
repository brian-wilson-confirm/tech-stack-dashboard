from sqlmodel import SQLModel, Field
from typing import Optional

"""
    PERSONS
"""
class Person(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    website: Optional[str]