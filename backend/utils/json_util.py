import json
import re

def safe_json_loads(response: str):
    # Try to extract JSON from response text
    json_match = re.search(r"\{.*\}", response, re.DOTALL)
    if not json_match:
        raise ValueError("No JSON object found in the response")
    
    json_text = json_match.group()
    
    # Optionally: replace single quotes with double quotes
    json_text = json_text.replace("'", '"')

    return json.loads(json_text)