from sqlalchemy.orm import Session
from .models import TechStackItem

def get_tech_stack(db: Session):
    return db.query(TechStackItem).all()