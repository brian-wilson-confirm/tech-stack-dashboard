from sqlmodel import Field, SQLModel

"""
    RESOURCE TYPES
"""
class ResourceType(SQLModel, table=True):
    __tablename__ = "resourcetype"

    id: int = Field(default=None, primary_key=True)
    name: str



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
