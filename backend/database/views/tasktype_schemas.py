from pydantic import BaseModel


"""
    TASK TYPE
"""
class TaskTypeBase(BaseModel):
    name: str


class TaskTypeCreate(TaskTypeBase):
    pass


class TaskTypeRead(TaskTypeBase):
    id: int