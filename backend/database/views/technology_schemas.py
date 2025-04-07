from pydantic import BaseModel


class TechnologyCreate(BaseModel):
    name: str
    subcategory_id: int

class TechnologyRead(BaseModel):
    id: int
    name: str
    subcategory: str
    category: str