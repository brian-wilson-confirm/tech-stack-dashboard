from fastapi import APIRouter, HTTPException
import os
from openai import OpenAI
from typing import List, Dict, Any
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Get API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)


@router.post("/analyze-course-category")
async def analyze_course_category(course_data: Dict[str, Any], categories: List[str]):
    try:
        prompt = build_prompt(course_data, categories)
        
        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-3.5-turbo",
            temperature=0.7,
            max_tokens=500,
        )

        # Response from OpenAI
        response = completion.choices[0].message.content

        # Parse the response into a JSON object
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    


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