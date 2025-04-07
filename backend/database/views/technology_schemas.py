from sqlmodel import SQLModel


class TechnologyCreate(SQLModel):
    name: str
    subcategory_id: int