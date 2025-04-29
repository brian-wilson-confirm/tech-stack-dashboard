from pydantic import BaseModel


"""
    TASK PRIORITY
"""
class TaskPriorityBase(BaseModel):
    name: str


class TaskPriorityCreate(TaskPriorityBase):
    pass


class TaskPriorityRead(TaskPriorityBase):
    id: int