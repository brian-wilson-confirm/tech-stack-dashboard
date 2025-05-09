import os, json, xml
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from backend.enums import ResponseType

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)


def submit_prompt(SYSTEM_PROMPT: str, USER_PROMPT: str, resp_type: ResponseType) -> str:
    try:
        SYSTEM_PROMPT += f"\nRespond only in valid {resp_type.value.upper()} format."

        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT}, 
                {"role": "user", "content": USER_PROMPT}
            ],
            model="gpt-4-turbo",
            temperature=0.2,        # Controls randomness/creativity
            max_tokens=500,         # Caps the length of the response (helps with cost and prevents over-generation)
            #frequency_penalty=0.0,  # Penalizes repeated phrases
            #presence_penalty=0.0    # Encourages introducing new topics
        )

        # Response from OpenAI
        response = completion.choices[0].message.content

        # Parse the response into a JSON object
        if resp_type == ResponseType.JSON:
            return json.loads(response)
        elif resp_type == ResponseType.XML:
            return xml.loads(response)
        else:
            return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 