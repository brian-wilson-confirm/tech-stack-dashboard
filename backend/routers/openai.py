from fastapi import APIRouter, HTTPException
import os
from openai import OpenAI
from typing import List, Dict, Any
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Get API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")
print("\n*******Debug - API Key present:", bool(api_key))  # Will print True if key is found, False if not
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)

def build_prompt(course_data: Dict[str, Any], categories: List[str]) -> str:
    return f"""Given the following course information:
Title: {course_data.get('title')}
Description: {course_data.get('description')}
Learning Objectives: {', '.join(course_data.get('learning_objectives', []))}
Prerequisites: {', '.join(course_data.get('prerequisites', []))}

Please analyze this course and suggest the most appropriate category from the following list:
{', '.join(categories)}

Provide your response in the following JSON format:
{{
  "category": "selected category",
  "reasoning": "detailed explanation for why this category is most appropriate"
}}"""

@router.post("/api/analyze-course-category")
async def analyze_course_category(course_data: Dict[str, Any], categories: List[str]):
    print("\n*******Debug - Received course_data: %s", course_data)
    print("\n*******Debug - Received categories: %s", categories)
    logger.debug("Debug - Received course_data: %s", course_data)
    logger.debug("Debug - Received categories: %s", categories)
    try:
        prompt = build_prompt(course_data, categories)
        
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-3.5-turbo",
            temperature=0.7,
            max_tokens=500,
        )

        response = completion.choices[0].message.content
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 