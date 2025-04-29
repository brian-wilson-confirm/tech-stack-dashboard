from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.person_models import Person
from backend.database.views.person_schemas import PersonCreate, PersonRead

router = APIRouter(prefix="/people")

"""
    GET Operations
"""
@router.get("/", response_model=List[PersonRead])
async def get_people(session: Session = Depends(get_session)):
    people = session.exec(select(Person)).all()
    return [serialize_person(person, session) for person in people]


@router.get("/count", response_model=int)
async def get_num_people(session: Session = Depends(get_session)):
    """Get the total number of people in the database."""
    return session.exec(select(func.count()).select_from(Person)).one()



"""
    POST Operations
"""
@router.post("/", response_model=Person)
async def create_person(person: PersonCreate, session: Session = Depends(get_session)):
    # Get/Create the topic id(s) for the task:: NOT USED YET
    return create_person(person.name, session)




"""
    PUT Operations
"""



"""
    DELETE Operations
"""



"""
    Helper functions
"""
def serialize_person(person: Person, session: Session) -> PersonRead:
    return PersonRead(
            id=person.id,
            name=person.name,
            website=person.website
            )


def create_person(person_name: str, session: Session):
    new_person = Person(name=person_name)
    session.add(new_person)
    session.commit()
    session.refresh(new_person)
    return new_person


def get_person_ids(person_names: List[str], session: Session):
    person_ids = []
    for person_name in person_names:
        person = session.exec(select(Person).where(Person.name == person_name)).first()
        if not person:
            person = create_person(person_name, session)
        person_ids.append(person.id)
    return person_ids