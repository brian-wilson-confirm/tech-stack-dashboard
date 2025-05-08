from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import json
from backend.llm.schemas.response import TaskResponse


llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

SYSTEM_PROMPT = """
                You are a learning assistant for a tech Learning Management System (LMS). Your job is to create a task from a lesson.

                Given a lesson title, resource type, and optionally a description, generate the following:
                - task_name: a user-facing label for the task (e.g., "Read \"Intro to Docker\"", "Watch \"CI/CD Explained\"", "Code \"FastAPI CRUD App\"")
                - task_description: a user-facing description of the task (e.g., "Read the article to learn about Docker containers and how to use them in your projects.")
                - task_type: choose from "reading", "watching", "listening", "coding", "reviewing", "building", "researching", "Installing", or "Debugging" based on the resource type
                - task_status: default to "not_started"
                - task_priority: choose from "low", "medium", "high", or "critical" based on content urgency or complexity

                Your task name should start with an action verb appropriate to the resource type.
                Examples:
                - If resource type is "Article" → use "Read"
                - If "Video" → use "Watch"
                - If "PDF" → use "Read"
                - If "Course" or "Tutorial" → use "Complete" or "Follow"
                - If "GitHub Repo" or "Code Sample" → use "Code"

                Return your result as a strict JSON object with keys:
                - task_name
                - task_description
                - task_type
                - task_status
                - task_priority

                Do not explain or include any extra output.
"""

#@tool
def _generate_task(resource_title: str, resource_type: str, lesson_description: str = "") -> TaskResponse:
    """
    Generates a task based on the lesson title and resource type.
    Returns a JSON string.
    """
    user_prompt = f"""
                    Resource Title: {resource_title}
                    Resource Type: {resource_type}
                    Lesson Description (optional): {lesson_description}
    """

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_prompt)
    ]

    response = llm(messages)
    try:
        result = json.loads(response.content)
        print(f"\n\nresult: {result}\n\n")
        #return json.dumps(result, indent=2)
        return TaskResponse(**result)
    except Exception as e:
        return json.dumps({"error": f"Failed to parse JSON: {str(e)}", "raw": response.content})
    
    # ✅ LangChain-compatible tool for agent use
    generate_task = tool(_generate_task_impl)