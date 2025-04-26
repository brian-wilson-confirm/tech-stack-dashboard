from sqlmodel import SQLModel, Field
from typing import Optional

"""
    SOURCES
"""
class Source(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str
    sourcetype_id: Optional[int] = Field(foreign_key="sourcetype.id")
    website: Optional[str]


"""
    SOURCE AUTHORS
"""
class SourceAuthor(SQLModel, table=True):
    __tablename__ = "source_author"

    source_id: int = Field(foreign_key="source.id", primary_key=True)
    person_id: int = Field(foreign_key="person.id", primary_key=True)


"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
