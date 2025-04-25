from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from backend.routers import other, tasks, tasksold, topics, lessons, courses, people
from backend.database.connection import engine
from backend.routers import openai

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
app.include_router(other.router, prefix="/api", tags=["other"])
app.include_router(openai.router, prefix="/api", tags=["openai"])


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