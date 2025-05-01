from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.publication_models import Publication
from backend.database.models.source_models import Source, SourceAuthor
from backend.database.models.sourcetype_models import SourceType
from backend.database.views.source_schemas import SourceCreate, SourceRead

router = APIRouter(prefix="/sources")

"""
    GET Operations
"""
@router.get("/", response_model=List[SourceRead])
async def get_sources(session: Session = Depends(get_session)):
    sources = session.exec(select(Source)).all()
    return [serialize_source(source, session) for source in sources]


@router.get("/count", response_model=int)
async def get_num_sources(session: Session = Depends(get_session)):
    """Get the total number of sources in the database."""
    return session.exec(select(func.count()).select_from(Source)).one()



"""
    POST Operations
"""
@router.post("/", response_model=Source)
async def create_source(source: SourceCreate, session: Session = Depends(get_session)):
    # Get/Create the topic id(s) for the task:: NOT USED YET
    return create_source(source.name, session)




"""
    PUT Operations
"""



"""
    DELETE Operations
"""



"""
    Helper functions
"""
def serialize_source(source: Source, session: Session) -> SourceRead:
    return SourceRead(
            id=source.id,
            name=source.name,
            website=source.website
            )


def create_source(source_name: str, sourcetype_id: int, session: Session):
    new_source = Source(name=source_name, sourcetype_id=sourcetype_id)
    session.add(new_source)
    session.commit()
    session.refresh(new_source)
    return new_source


def create_sourcetype(sourcetype_name: str, session: Session):
    new_sourcetype = SourceType(name=sourcetype_name)
    session.add(new_sourcetype)
    session.commit()
    session.refresh(new_sourcetype)
    return new_sourcetype


# NO LONGER NEEDED! 4/30/25
def create_source_authors(source_id: int, person_ids: List[int], session: Session):
    for person_id in person_ids:
        # Check if the course_category relationship already exists
        existing_relation = session.exec(
            select(SourceAuthor).where(
                SourceAuthor.source_id == source_id,
                SourceAuthor.person_id == person_id
            )
        ).first()
        
        # If the relationship doesn't exist, create it
        if not existing_relation:
            create_source_author(source_id, person_id, session)


# NO LONGER NEEDED! 4/30/25
def create_source_author(source_id: int, person_id: int, session: Session):
    source_author = SourceAuthor(source_id=source_id, person_id=person_id)
    session.add(source_author)
    session.commit()
    session.refresh(source_author)
    return source_author


def get_source_id(source_name: str, sourcetype_id: int, session: Session):
    source = session.exec(select(Source).where(Source.name == source_name)).first()
    if not source:
        source = create_source(source_name, sourcetype_id,session)
    return source.id


def get_sourcetype_id(sourcetype_name: str, session: Session):
    sourcetype = session.exec(select(SourceType).where(SourceType.name == sourcetype_name)).first()
    if not sourcetype:
        sourcetype = create_sourcetype(sourcetype_name, session)
    return sourcetype.id


def get_publication_id(publication_name: str, source_id: int, session: Session):
    publication = session.exec(select(Publication).where(Publication.name == publication_name, Publication.source_id == source_id)).first()
    if not publication:
        publication = create_publication(publication_name, source_id, session)
    return publication.id


def create_publication(publication_name: str, source_id: int, session: Session):
    new_publication = Publication(name=publication_name, source_id=source_id)
    session.add(new_publication)
    session.commit()
    session.refresh(new_publication)
    return new_publication  