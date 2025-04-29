from pydantic import BaseModel


"""
    PERSONS
"""
class PersonBase(BaseModel):
    name: str
    website: str


class PersonCreate(PersonBase):
    pass


class PersonRead(PersonBase):
    id: int