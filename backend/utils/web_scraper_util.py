import requests
from newspaper import Article
from bs4 import BeautifulSoup
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from newspaper import ArticleException


def extract_article_metadata(url: str):

    # Check if it's a Medium article by inspecting meta generator# Step 1: Directly fetch raw HTML
    raw_html = requests.get(url).text
    soup = BeautifulSoup(raw_html, "html.parser")
    site_name_tag = soup.find("meta", attrs={"property": "og:site_name"})
    site_name = site_name_tag.get("content") if site_name_tag else None
    site_type_tag = soup.find("meta", attrs={"property": "og:type"})
    site_type = site_type_tag.get("content") if site_type_tag else None


    # Step 2: Parse with newspaper
    try:
        article = Article(url)
        article.download()
        article.parse()
    except ArticleException as e:
        return {
            "error": f"Failed to fetch article from URL: {str(e)}"
        }

    #article.html
    #article.meta_favicon

    return WebMetadata(
        lesson=LessonMetadata(
            title=article.title,
            description=article.meta_description,
            tags=article.meta_keywords,
            content=article.text,
            level="unknown",
            publish_date=article.publish_date,
            top_image=article.top_image,
            summary=article.summary
        ),
        resource=ResourceMetadata(
            title=article.title,
            description=article.meta_description,
            url=article.url,
            resourcetype=site_type,
            source=SourceMetadata(
                name=site_name,
                sourcetype="Author" if article.authors else "Publisher",
                authors=article.authors if article.authors else None
            )
        )
    )



class LessonMetadata(BaseModel):
    title: str
    description: str
    tags: List[str]
    content: str
    level: str
    publish_date: Optional[datetime]
    top_image: str
    summary: str


class SourceMetadata(BaseModel):
    name: str
    sourcetype: str
    authors: List[str]


class ResourceMetadata(BaseModel):
    title: str
    description: str
    url: str
    resourcetype: str
    source: SourceMetadata


class WebMetadata(BaseModel):
    lesson: LessonMetadata
    resource: ResourceMetadata

