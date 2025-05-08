from fastapi import APIRouter


router = APIRouter(prefix="/summary")


"""
    GET Operations
"""
@router.get("/")
async def get_summary():
    print("Getting summary")
    return {"message": "Hello, Summary!"}