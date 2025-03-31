from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.api.routes import dashboard
from backend.database import SessionLocal, engine
from backend.models import Base
from backend.crud import get_tech_stack


Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include dashboard routes
app.include_router(dashboard.router, prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/tech-stack")
def read_stack(db: Session = Depends(get_db)):
    return get_tech_stack(db)

@app.get("/")
async def root():
    return {"message": "Tech Stack Dashboard API"}
