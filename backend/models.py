from sqlalchemy import Column, Integer, String
from .database import Base

class TechStackItem(Base):
    __tablename__ = "tech_stack"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)