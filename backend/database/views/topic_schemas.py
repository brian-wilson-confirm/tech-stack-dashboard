from pydantic import BaseModel
from typing import Optional

class TopicCreate(BaseModel):
    name: Optional[str] = None

class TopicRead(BaseModel):
    id: int
    name: Optional[str] = None