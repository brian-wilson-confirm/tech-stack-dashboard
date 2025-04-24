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
    return f"""
            You are an assistant that classifies resources into only 1 or more of the following predefined tech learning categories:

                CATEGORIES:
                {', '.join(categories)}

            Given the following course information:

                Course Title: {course_data.get('title')}    
                Course Description: {course_data.get('description')}
                Resource Title: {course_data.get('resource').get('title')}
                Resource Description: {course_data.get('resource').get('description')}
                Resource Type: {course_data.get('resource').get('resource_type')}
                Resource URL: {course_data.get('resource').get('url')}
                Source Name: {course_data.get('resource').get('source').get('name')}
                Source Type: {course_data.get('resource').get('source').get('source_type')}

            Please analyze this course and suggest the most appropriate category from the predefined list of valid categories.

            Provide your response in the following JSON format:
            {{
                "courses": [
                    {{
                    "course": "<Course Title>",
                    "categories": [
                        {{
                        "category": "<Selected Category>",
                        "reasoning": "<One sentence explanation>"
                        }}
                    ]
                    }}
                ]
            }}
            """




"""
def build_prompt(course_data: Dict[str, Any], categories: List[str]) -> str:
    return f
            Given the following course information:
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
            }}
            """

@router.post("/analyze-course-category")
async def analyze_course_category(course_data: Dict[str, Any], categories: List[str]):
    print("\n*******Debug - Received course_data: %s", course_data)
    print("\n*******Debug - Received categories: %s", categories)
    logger.debug("Debug - Received course_data: %s", course_data)
    logger.debug("Debug - Received categories: %s", categories)
    try:
        prompt = build_prompt(course_data, categories)
        print("\n*******Debug - Prompt: %s", prompt)
        
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