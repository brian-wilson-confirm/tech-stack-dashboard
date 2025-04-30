from langchain.agents import initialize_agent, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.tools import Tool
from typing import Optional
import json

# Import your async article scraper
from backend.llm.tools.resource_classifier_tool import _classify_resource
from backend.llm.tools.lesson_classifier_tool import _classify_lesson
from backend.llm.tools.task_generator_tool import _generate_task
from backend.llm.tools.taxonomy_search_tool import taxonomy_search
from backend.llm.tools.pdf_reader_tool import extract_pdf_text
from backend.llm.tools.web_scraper_tool import scrape_web_article1
from backend.llm.tools.youtube_tool import extract_youtube_metadata
from backend.utils.web_scraper_util import extract_article_metadata
from backend.llm.schemas.article import RawArticle


llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

# Define tools
tools = [
    Tool.from_function(
        func=_classify_resource,
        name="classify_resource",
        description="Classify the resource as a video, article, or other"
    ),
    Tool.from_function(
        func=_classify_lesson,
        name="classify_lesson",
        description="Classify the lesson as a video, article, or other"
    ),
    Tool.from_function(
        func=_generate_task,
        name="generate_task",
        description="Generate a task from the lesson"
    ),
    Tool.from_function(
        func=taxonomy_search,
        name="taxonomy_search",
        description="Search the taxonomy for the lesson"
    ),
    Tool.from_function(
        func=extract_pdf_text,
        name="extract_pdf_text",
        description="Extract the text from a PDF"
    ),
    Tool.from_function(
        func=extract_youtube_metadata,
        name="extract_youtube_metadata",
        description="Extract the metadata from a YouTube video"
    ),
    Tool.from_function(
        func=extract_article_metadata,
        name="extract_article_metadata",
        description="Extract the metadata from an article"
    )
]

# Main agent init
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True
)

async def run_url_ingestion_pipeline(url: str) -> Optional[dict]:
    try:
        raw: RawArticle = await scrape_web_article1(url)

        # 1. Classify the resource
        resource_result = _classify_resource(
            article_text=raw.text,
            article_url=raw.url,
            article_title=raw.title
        )

        # 2. Extract lesson metadata
        lesson_result = _classify_lesson(
            text=raw.text,
            title=raw.title
        )

        # 3. Generate task metadata
        task_result = _generate_task(
            lesson_title=raw.title,
            resource_type=json.loads(resource_result)["resource_type"],
            lesson_description=json.loads(lesson_result)["lesson_description"]
        )

        # 4. Compose the final JSON structure
        return {
            "source_type": json.loads(resource_result)["source_type"],
            "source": json.loads(resource_result)["source_name"],
            "author": raw.author,
            "resource_type": json.loads(resource_result)["resource_type"],
            "resource": {
                "title": json.loads(resource_result)["resource_title"],
                "description": json.loads(resource_result)["resource_description"],
                "url": raw.url
            },
            "lesson": {
                "title": json.loads(lesson_result)["lesson_title"],
                "description": json.loads(lesson_result)["lesson_description"],
                "estimated_duration": json.loads(lesson_result)["estimated_duration"],
                "level": json.loads(lesson_result)["level"]
            },
            "task": json.loads(task_result)
        }

    except Exception as e:
        return {"error": str(e)}