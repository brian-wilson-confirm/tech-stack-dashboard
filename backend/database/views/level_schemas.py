from pydantic import BaseModel


"""
    LEVELS
"""
class LevelBase(BaseModel):
    name: str


class LevelCreate(LevelBase):
    pass


class LevelRead(LevelBase):
    id: int