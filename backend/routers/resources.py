from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlmodel import Session, select
from backend.database.connection import get_session
from backend.database.models.resource_models import Resource
from backend.database.models.resourcetype_models import ResourceType
from backend.database.views.resource_schemas import ResourceCreate, ResourceRead

router = APIRouter(prefix="/resources")

"""
    GET Operations
"""
@router.get("/", response_model=List[ResourceRead])
async def get_resources(session: Session = Depends(get_session)):
    resources = session.exec(select(Resource)).all()
    return [serialize_resource(resource, session) for resource in resources]


@router.get("/count", response_model=int)
async def get_num_resources(session: Session = Depends(get_session)):
    """Get the total number of resources in the database."""
    return session.exec(select(func.count()).select_from(Resource)).one()



"""
    POST Operations
"""
@router.post("/", response_model=Resource)
async def create_resource(resource: ResourceCreate, session: Session = Depends(get_session)):
    # Get/Create the topic id(s) for the task:: NOT USED YET
    return create_resource(resource.name, session)




"""
    PUT Operations
"""



"""
    DELETE Operations
"""



"""
    Helper functions
"""
def serialize_resource(resource: Resource, session: Session) -> ResourceRead:
    return ResourceRead(
            id=resource.id,
            name=resource.name,
            website=resource.website
            )


def create_resource(title: str, description: str, url: str, resourcetype_id: int, source_id: int, session: Session):
    new_resource = Resource(title=title, description=description, url=url, resourcetype_id=resourcetype_id, source_id=source_id)
    session.add(new_resource)
    session.commit()
    session.refresh(new_resource)
    return new_resource


def create_resourcetype(resourcetype_name: str, session: Session):
    new_resourcetype = ResourceType(name=resourcetype_name)
    session.add(new_resourcetype)
    session.commit()
    session.refresh(new_resourcetype)
    return new_resourcetype


def get_resource_id(resourcetype_id: int, source_id: int, resourcetitle: str, resourcedescription: str, resourceurl: str, session: Session):
    resource = session.exec(select(Resource)
                            .where(Resource.title == resourcetitle)
                            .where(Resource.resourcetype_id == resourcetype_id)
                            .where(Resource.source_id == source_id)).first()
    if not resource:
        resource = create_resource(resourcetitle, resourcedescription, resourceurl, resourcetype_id, source_id, session)
    return resource.id


def get_resourcetype_id(resourcetype_name: str, session: Session):
    resourcetype = session.exec(select(ResourceType).where(ResourceType.name == resourcetype_name)).first()
    if not resourcetype:
        resourcetype = create_resourcetype(resourcetype_name, session)
    return resourcetype.id

