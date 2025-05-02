from pydantic import BaseModel
from typing import Optional

class TechnologyCreate(BaseModel):
    name: str
    description: Optional[str] = None

class TechnologyRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None