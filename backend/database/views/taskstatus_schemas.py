from pydantic import BaseModel


"""
    TASK STATUS
"""
class TaskStatusBase(BaseModel):
    name: str


class TaskStatusCreate(TaskStatusBase):
    pass


class TaskStatusRead(TaskStatusBase):
    id: int