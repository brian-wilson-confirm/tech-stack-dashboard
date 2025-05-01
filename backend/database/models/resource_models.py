from sqlmodel import SQLModel, Field
from typing import Optional

"""
    RESOURCES
"""
class Resource(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}

    id: int = Field(default=None, primary_key=True)
    title: str
    description: Optional[str]
    resourcetype_id: Optional[int] = Field(foreign_key="resourcetype.id")
    url: Optional[str]
    source_id: Optional[int] = Field(foreign_key="source.id")


"""
    RESOURCE AUTHORS
"""
class ResourceAuthor(SQLModel, table=True):
    __tablename__ = "resource_author"

    resource_id: int = Field(foreign_key="resource.id", primary_key=True)
    person_id: int = Field(foreign_key="person.id", primary_key=True)