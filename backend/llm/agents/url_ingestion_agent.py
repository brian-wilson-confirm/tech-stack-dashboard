from fastapi import WebSocket
from langchain.agents import initialize_agent, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.tools import Tool
from typing import Optional
import json
from sqlmodel import Session
# Import your async article scraper
from backend.database.connection import get_session
from backend.llm.tools.resource_classifier_tool import _enrich_resource
from backend.llm.tools.lesson_classifier_tool import _enrich_lesson
from backend.llm.tools.task_generator_tool import _generate_task
from backend.llm.tools.taxonomy_search_tool import taxonomy_search
from backend.llm.tools.pdf_reader_tool import extract_pdf_text
from backend.llm.tools.web_scraper_tool import scrape_web_article1
from backend.llm.tools.youtube_tool import extract_youtube_metadata
from backend.routers.lessons import get_taxonomy
from backend.utils.web_scraper_util import extract_article_metadata
from backend.llm.schemas.article import RawArticle
from backend.llm.schemas.metadata import Metadata, ResourceMetadata, SourceMetadata, LessonMetadata, TaskMetadata, CategoryMetadata, TechnologyMetadata
from backend.utils.websocket_util import update_progress

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0.2)

# Define tools
tools = [
    Tool.from_function(
        func=_enrich_resource,
        name="enrich_resource",
        description="Enrich the resource metadata"
    ),
    Tool.from_function(
        func=_enrich_lesson,
        name="enrich_lesson",
        description="Enrich the lesson metadata"
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

async def run_url_ingestion_pipeline(url: str, websocket: WebSocket, session: Session) -> Metadata:
    try:
        article: RawArticle = await scrape_web_article1(url)

        # Call LLM tool to enrich the resource/source metadata
        await update_progress(websocket, 10, "Retreiving Resource Metadata...")
        resource_response = _enrich_resource(
            url = article.url,
            title = article.title,
            text = article.text
        )

        # Call LLM tool to enrich and classify the lesson metadata
        await update_progress(websocket, 33, "Constructing Lesson Metadata...")
        lesson_response = _enrich_lesson(
            title=article.title,
            text=article.text,
            taxonomy=get_taxonomy(session)
        )

        # Call LLM tool to enrich the task metadata 
        await update_progress(websocket, 84, "Constructing Task Metadata...")
        task_response = _generate_task(
            resource_title=article.title,
            resource_type=resource_response.resource_type,
            lesson_description=lesson_response.lesson_description
        )

        # Compose the final JSON structure
        return Metadata(
            resource=ResourceMetadata(
                title=resource_response.resource_title,
                description=resource_response.resource_description,
                url=article.url,
                type=article.resource_type if article.resource_type else resource_response.resource_type,
                image_url=article.img_url if article.img_url else resource_response.resource_image_url,
                authors=article.authors if article.authors else resource_response.resource_authors
            ),
            source=SourceMetadata(
                name=resource_response.source_name,
                type=resource_response.source_type,
                website=resource_response.source_url,
                image_url=article.favicon_url if article.favicon_url else resource_response.source_image_url,
                publication_name=resource_response.publication_name
            ),
            lesson=LessonMetadata(
                title=article.title,
                description=lesson_response.lesson_description,
                content=article.text,
                estimated_duration=lesson_response.estimated_duration,
                level=lesson_response.level,
                topics=lesson_response.topics,
                categories=lesson_response.categories,
                technologies=lesson_response.technologies
            ),  
            task=TaskMetadata(
                name=task_response.task_name,
                description=task_response.task_description,
                type=task_response.task_type,
                status=task_response.task_status,
                priority=task_response.task_priority
            )
        )

    except Exception as e:
        return {"error": str(e)}