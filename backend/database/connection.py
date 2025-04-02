from sqlmodel import create_engine, Session

# DATABASE_URL = "postgresql://postgres:yourpassword@localhost:5432/your_db"
DATABASE_URL = "postgresql://brianwilson@localhost:5432/postgres"


engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session