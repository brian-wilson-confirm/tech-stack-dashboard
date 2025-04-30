from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json

# Instantiate the LLM
llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

SYSTEM_INSTRUCTION = """
You are an intelligent assistant for a Learning Management System (LMS).
Given raw content extracted from a URL (such as an article, video, PDF, etc.), your job is to classify:
- the source type (e.g., Blog, Documentation, Course, YouTube Channel, News, GitHub, etc.)
- the source name (e.g., Medium, RealPython, YouTube, Towards Data Science, Mozilla Docs)
- the resource type (e.g., Article, PDF, Video, Tweet, Book)
- the cleaned resource title and a 1–2 sentence description of the content

Return your response as a strict JSON object with keys:
- source_type
- source_name
- resource_type
- resource_title
- resource_description

Only include those fields. Do not explain or include anything else.
"""

#@tool
def _classify_resource(article_text: str, article_url: str, article_title: str) -> str:
    """
    Classifies the resource metadata from scraped article content.
    Returns a JSON string.
    """
    user_prompt = f"""
                    Article Title: {article_title}
                    Article URL: {article_url}

                    Full Text:
                    {article_text[:3000]}  # limit to first ~3000 characters to stay within token limits
    """

    messages = [
        SystemMessage(content=SYSTEM_INSTRUCTION),
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
    classify_resource = tool(_classify_resource_impl)
