from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json
from backend.llm.schemas.response import LessonResponse


llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

SYSTEM_PROMPT = """

            You are a smart system design assistant responsible for classifying a Lesson into specific Categories, Subcategories, Technologies, and Topics for a Learning Management System (LMS).

            A **Lesson** is the smallest structured unit of learning content within the platform I am building.
            It delivers a focused concept or skill, often as part of a broader Module and Course, but can also be standalone.

            A **Technology** is a practical, real-world tool, framework, or service that helps design, develop, build, manage, deploy, or secure systems.

            A **Topic** is a focused, reusable concept, skill, best practice, or architectural pattern (such as "Authentication", "Unit Testing", or "Caching") that a Lesson covers or applies. 
            Topics are more granular than subcategories and may be relevant across multiple categories, subcategories, or technologies.

            ### 📚 Taxonomy

            Use the following predefined taxonomy when making your selections.
            Each taxonomy entry includes a **Category** and one or more associated **Subcategories**.
            You must only select from this list — do not invent new ones:
            
            {taxonomy}

            ---
       
            ### 🛠 Available Technologies (Examples)

            Each technology has a **Category** and **Subcategory** associated with it. 
            There is no strict list of technologies, but every technology must map to 1 or more subcategories.
            Identify technologies relevant to the lesson if appropriate.
            Some examples of technologies include:
            - Python
            - JavaScript
            - React
            - Node.js
            - Express
            - MongoDB
            - PostgreSQL
            - Docker
            - Kubernetes
            - Terraform
            - Ansible
            - Cloudflare
            - Apache Kafka

            ---

            ### 📚 Available Topics

            Suggest a topic or topics if you believe it is highly relevant and applicable to the lesson. There is no strict list of topics.

            Examples of topics include but are not limited to: Authentication, Unit Testing, State Management, Error Handling, CI/CD, Container Orchestration, etc.

            ---

            ### 📚 Available Levels

            Choose only from the allowed list: beginner, intermediate, advanced, expert, unknown.

            ---

            ### 🎯 Instructions

            Your task is to analyze the input title and text for the lesson, generate additional metadata, and classify the lesson appropriately: 
            - You may assign multiple subcategories to a single category, if relevant.
            - Only choose categories and subcategories from the predefined taxonomy provided.
            - Only include the most relevant categories (1–3 max)

            - If applicable, suggest one or more technologies associated with the lesson:
            -- For each technology identified, list which subcategories it is associated with.
            
            - If applicable, suggest one or more topics associated with the lesson.

            - Assign the correct **Level** to the lesson based on its expected difficulty:
            -- Choose only from the allowed list: beginner, intermediate, advanced, expert, unknown.
            -- Use the input information provided to infer the level.
            -- If the difficulty is unclear, select "unknown".
            
            - Estimate how long it would take to read or complete the lesson:
            -- If an explicit read time is mentioned (e.g., "7 min read"), use it.
            -- If no time is mentioned, estimate based on the content description.
            -- Assume an average reading speed of 150–200 words per minute for technical material.
            -- Return the estimated duration in **ISO 8601 Duration format** (e.g., "PT30M" for 30 minutes, "PT2H" for 2 hours).

            ---

            ### 📤 Output Format (JSON)

            Return it strictly as a JSON object with the following keys:
            {{
                "lesson_title": "<Short, Human-Readable Title>",
                "lesson_description": "<1-3 Sentence Summary of What This Lesson Teaches>",
                "estimated_duration": "<ISO 8601 Duration Format (e.g., \"PT15M\" for 15 minutes)>",
                "level": "<One of the following values: beginner, intermediate, advanced, expert, unknown>",
                "topics": "<List of topics that are covered in the lesson>",
                "categories": [
                    {{
                        "category": "<Selected Category>",
                        "subcategories": "<List of subcategories that are covered in the lesson>"
                    }}
                ],
                "technologies": [
                    {{
                        "technology": "<Selected Technology>",
                        "subcategories": "<List of subcategories that this particular technology is relevant to>"
                    }}
                ],
            }}

            Only include those fields. Do not explain or include anything else.
            """

#@tool
def _enrich_lesson(title: str, text: str, taxonomy: str) -> LessonResponse:
    """
    Analyzes raw article text and generates lesson metadata (title, description, duration, level).
    Returns JSON string.
    """
    user_prompt = f"""
                    Lesson Title: {title}

                    Full Content:
                    {text[:3000]}
    """

    messages = [
        SystemMessage(content=SYSTEM_PROMPT.format(taxonomy=taxonomy)),
        HumanMessage(content=user_prompt)
    ]

    
    response = llm(messages)
    try:
        result = json.loads(response.content)
        print(f"\n\nresult: {result}\n\n")
        #return json.dumps(result, indent=2)
        return LessonResponse(**result)
    except Exception as e:
        return json.dumps({"error": f"Failed to parse JSON: {str(e)}", "raw": response.content})
    
    # ✅ LangChain-compatible tool for agent use
    enrich_lesson = tool(_enrich_lesson_impl)