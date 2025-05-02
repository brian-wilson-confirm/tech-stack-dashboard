from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json
from backend.llm.schemas.response import ResourceResponse


# Instantiate the LLM
llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

SYSTEM_INSTRUCTION = """
You are an intelligent assistant for a tech Learning Management System (LMS).
Given the URL and raw content extracted from that URL, analyze the page and extract structured metadata about the resource and its source.

---

### 🧠 Resource Metadata

- You MUST extract the full names of the author(s) of the resource if they are present from the raw text, even if the names are only mentioned once or are styled in headers.
- Look for full names near the top of the article (e.g., "by Brian Wilson") or inline phrases such as:
    - “This post was written by...”
    - “Posted by...”
    - “Article by...”
- The author may also be mentioned in:
    - HTML metadata tags like: <meta name="author" content="..."> or <span property="author">...</span> or <meta property="article:author" content="...">
    - Embedded in the title block or subtitle
    - Under the headline or near the publication date
    - In the footer or credits section
    - Styled in small font, bold, or italic near the top or bottom
- If multiple authors are present, return them as a JSON list of full names.
- Even if no author is mentioned in HTML metadata, look for the author's full name in the visible article content or headings.
- Do NOT include organizations or platforms (e.g. “Hugging Face”) unless the content is explicitly credited to the org (e.g., “By Hugging Face Team”).
- If no author is found, return an empty list.

---

### 🏷️ Source Metadata

Extract information about the source platform, publication, and type of content.

---

### 📤 Output Format

Return your result strictly in the following JSON format:
{{
    "resource_title": "<Cleaned Resource Title>",
    "resource_description": "<1–2 Sentence Description of the Content>",
    "resource_type": "<Resource Type (e.g., article, pdf, video, tweet, book)>",
    "resource_url": "<Resource URL (e.g., https://medium.com/@john_doe/my-article, https://www.youtube.com/watch?v=1234567890)>",
    "resource_image_url": "<Primary Image URL for the Resource (if available)>",
    "resource_authors": <List of full names of the author(s) (e.g., ["John Doe", "Jane Smith"])>,
    "source_name": "<Source Name (e.g., Medium, RealPython, YouTube, Mozilla Docs, Microsoft Docs, AWS Docs, Python.org, etc.)>",
    "publication_name": "<Publication Name (e.g., The Startup, The PyThoneers, Fireship, Veritasium, MDN Web Docs, Azure SDK Docs, Lambda Developer Guide, etc.)>",
    "source_type": "<Source Type (e.g., blog, documentation, course, YouTube channel, news, github, online platform, etc.)>",
    "source_url": "<Source URL (e.g., https://medium.com/@john_doe, https://www.youtube.com/@channel_name, https://towardsdatascience.com/category/machine-learning)>",
    "source_image_url": "<Primary Image URL for the Source (if available)>",
}}


Only include those fields and return valid JSON. Do not explain or include anything else.
"""

#@tool
def _enrich_resource(url: str, title: str, text: str, html: str) -> ResourceResponse:
    """
    Classifies the resource metadata from scraped article content.
    Returns a JSON string.
    """
    user_prompt = f"""
                    Article Title: {title}
                    Article URL: {url}

                    Full Text:
                    {text[:3000]}  # limit to first ~3000 characters to stay within token limits

                    Full HTML:
                    {html[:3000]}  # limit to first ~3000 characters to stay within token limits
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
