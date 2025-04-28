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

    # Remove trailing commas before a closing bracket or brace
    json_text = remove_trailing_commas(json_text)

    return json.loads(json_text)


def remove_trailing_commas(json_text: str) -> str:
    # Removes trailing commas before a closing bracket or brace
    return re.sub(r',(\s*[}\]])', r'\1', json_text)