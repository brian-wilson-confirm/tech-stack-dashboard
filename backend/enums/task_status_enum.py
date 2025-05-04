from enum import Enum

class TaskStatusEnum(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed" 
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"