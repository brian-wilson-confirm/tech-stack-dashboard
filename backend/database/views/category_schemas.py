from pydantic import BaseModel

class CategoryRead(BaseModel):
    id: int
    name: str