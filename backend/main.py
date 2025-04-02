from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from backend.routers import dashboard
from backend.database import engine
from backend.routers import tasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(dashboard.router, prefix="/api")
#app.include_router(tasks_router, prefix="/api", tags=["tasks"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


"""
@app.get("/api/tech-stack")
def read_stack(db: Session = Depends(get_session)):
    return get_tech_stack(db)
"""


@app.get("/")
async def root():
    return {"message": "Tech Stack Dashboard API"}