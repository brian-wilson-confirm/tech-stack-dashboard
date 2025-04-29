from sqlmodel import Field, SQLModel

"""
    SOURCE TYPES
"""
class SourceType(SQLModel, table=True):
    __tablename__ = "sourcetype"

    id: int = Field(default=None, primary_key=True)
    name: str



"""
    TASK DEPENDENCIES
"""



"""
    DEPENDENCY RELATIONSHIPS
"""
