from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from backend.routers import other, tasks, tasksold, topics, lessons, courses, people, sources, resources, levels, categories, subcategories, technologies, settings, summary
from backend.database.connection import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(tasksold.router, prefix="/api", tags=["tasksold"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(topics.router, prefix="/api", tags=["topics"])
app.include_router(lessons.router, prefix="/api", tags=["lessons"])
app.include_router(courses.router, prefix="/api", tags=["courses"])
app.include_router(people.router, prefix="/api", tags=["people"])
app.include_router(sources.router, prefix="/api", tags=["sources"])
app.include_router(resources.router, prefix="/api", tags=["resources"])
app.include_router(levels.router, prefix="/api", tags=["levels"])
app.include_router(categories.router, prefix="/api", tags=["categories"])
app.include_router(subcategories.router, prefix="/api", tags=["subcategories"])
app.include_router(technologies.router, prefix="/api", tags=["technologies"])
app.include_router(settings.router, prefix="/api", tags=["settings"])
app.include_router(summary.router, prefix="/api", tags=["summary"])
app.include_router(other.router, prefix="/api", tags=["other"])


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Tech Stack Dashboard API"}