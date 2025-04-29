from pydantic import BaseModel
from typing import List

class LLMResponseModel(BaseModel):
    llm_response: str
