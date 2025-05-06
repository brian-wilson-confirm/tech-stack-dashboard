from sqlmodel import SQLModel, Field
from typing import Optional

class TaskTypeWeight(SQLModel, table=True):
    __tablename__ = "task_type_weights"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    task_type_id: int = Field(foreign_key="task_type.id")
    weight: int = Field(ge=0, le=10)
