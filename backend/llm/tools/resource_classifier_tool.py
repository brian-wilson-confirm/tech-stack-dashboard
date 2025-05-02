from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json
from backend.llm.schemas.response import ResourceResponse


# Instantiate the LLM
llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

SYSTEM_INSTRUCTION = """
You are an intelligent assistant for a tech Learning Management System (LMS).
Given the URL and the raw content extracted from that URL, your job is to analyze the page and extract key resource and source metadata.

---

### Resource Metadata

- You MUST attempt to identify the authors of the resource.
- Authors may be listed at the top or bottom of the article, embedded in metadata, or styled in small/bold fonts.
- Check for author names in tags like <meta name="author" content="John Doe">, <span property="author">Jane Smith</span>, <span property="name">Jane Smith</span>, etc.
- If multiple authors are present, include them as a list of full names.
- Do not return organizations as authors

---

### Source Metadata


---

Return your result strictly as a JSON object with the following keys:
{{
    "resource_title": "<Cleaned Resource Title>",
    "resource_description": "<1–2 Sentence Description of the Content>",
    "resource_type": "<Resource Type (e.g., article, pdf, video, tweet, book)>",
    "resource_url": "<Resource URL (e.g., https://medium.com/@john_doe/my-article, https://www.youtube.com/watch?v=1234567890)>",
    "resource_image_url": "<Primary Image URL for the Resource (if available)>",
    "resource_authors": "<List of full Author names(e.g., [\"John Doe\", \"Jane Smith\"]))",
    "source_name": "<Source Name (e.g., Medium, RealPython, YouTube, Mozilla Docs, Microsoft Docs, AWS Docs, Python.org, etc.)>",
    "publication_name": "<Publication Name (e.g., The Startup, The PyThoneers, Fireship, Veritasium, MDN Web Docs, Azure SDK Docs, Lambda Developer Guide, etc.)>",
    "source_type": "<Source Type (e.g., blog, documentation, course, YouTube channel, news, github, online platform, etc.)>",
    "source_url": "<Source URL (e.g., https://medium.com/@john_doe, https://www.youtube.com/@channel_name, https://towardsdatascience.com/category/machine-learning)>",
    "source_image_url": "<Primary Image URL for the Source (if available)>",
}}


Only include those fields. Do not explain or include anything else.
"""

#@tool
def _enrich_resource(url: str, title: str, text: str) -> ResourceResponse:
    """
    Classifies the resource metadata from scraped article content.
    Returns a JSON string.
    """
    user_prompt = f"""
                    Article Title: {title}
                    Article URL: {url}

                    Full Text:
                    {text[:3000]}  # limit to first ~3000 characters to stay within token limits
    """

    messages = [
        SystemMessage(content=SYSTEM_INSTRUCTION),
        HumanMessage(content=user_prompt)
    ]

    response = llm(messages)
    try:
        result = json.loads(response.content)
        print(f"\n\nresult: {result}\n\n")
        #return json.dumps(result, indent=2)
        return ResourceResponse(**result)
    except Exception as e:
        return json.dumps({"error": f"Failed to parse JSON: {str(e)}", "raw": response.content})
    
    # ✅ LangChain-compatible tool for agent use
    enrich_resource = tool(_enrich_resource_impl)
