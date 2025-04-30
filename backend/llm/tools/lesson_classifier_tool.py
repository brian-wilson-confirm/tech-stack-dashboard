from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

SYSTEM_PROMPT = """
You are a lesson generation assistant for a learning platform.
Your task is to analyze a piece of learning content and generate metadata for a lesson object.

Based on the input text and title, extract:
- lesson_title: A short, human-readable title
- lesson_description: 1-3 sentence summary of what this lesson teaches
- estimated_duration: In ISO 8601 duration format (e.g., "PT15M" for 15 minutes)
- level: One of the following values: beginner, intermediate, advanced, expert, unknown

Return your response as a JSON object with those four fields. Do not explain or include any other text.
"""

#@tool
def _classify_lesson(text: str, title: str) -> str:
    """
    Analyzes raw article text and generates lesson metadata (title, description, duration, level).
    Returns JSON string.
    """
    user_prompt = f"""
                    Content Title: {title}

                    Full Content:
                    {text[:3000]}
    """

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt)
    ]

    response = llm(messages)
    try:
        result = json.loads(response.content)
        print(f"\n\nresult: {result}\n\n")
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({"error": f"Failed to parse JSON: {str(e)}", "raw": response.content})
    
    # ✅ LangChain-compatible tool for agent use
    classify_lesson = tool(_classify_lesson_impl)