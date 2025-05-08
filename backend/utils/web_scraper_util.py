import requests
from newspaper import Article
from bs4 import BeautifulSoup
from typing import List, Optional
from datetime import datetime
from newspaper import ArticleException
from dataclasses import dataclass
import re
import math
#from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright


# REMOVE? THIS CODE IS FOR ARCHIVE LINKS BUT THE METADATA LOOKS BAD
"""
async def scrape_article(url: str) -> Article:
    #async with sync_playwright() as p:
    p = await async_playwright().start()  # ✅ FIX HERE
    browser = await p.chromium.launch(headless=True)
    page = await browser.new_page()
    await page.goto(url, timeout=60000)
    html = await page.content()
    await browser.close()
    await p.stop()

    soup = BeautifulSoup(html, "html.parser")

    # Try to extract reasonable metadata
    title = soup.title.string.strip() if soup.title else "Untitled"
    paragraphs = soup.find_all("p")
    text = "\n\n".join(p.get_text().strip() for p in paragraphs if p.get_text().strip())

    # Estimate reading time (average 200 wpm)
    word_count = len(re.findall(r'\w+', text))
    estimated_minutes = max(1, math.ceil(word_count / 200))

    # Try to infer author or published date if present
    author = None
    pub_date = None

    # Simple heuristics
    if meta_author := soup.find("meta", {"name": "author"}):
        author = meta_author.get("content")

    if meta_date := soup.find("meta", {"property": "article:published_time"}):
        pub_date = meta_date.get("content")

    return Article(
        title=title,
        author=author,
        text=text,
        published_date=pub_date,
        estimated_read_time_minutes=estimated_minutes,
        source_url=url
    )
"""


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
        return WebMetadata(
            error=f"Failed to fetch article from URL: {str(e)}"
        )

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


@dataclass
class LessonMetadata:
    title: str
    description: str
    tags: List[str]
    content: str
    level: str
    publish_date: Optional[datetime]
    top_image: str
    summary: str


@dataclass
class SourceMetadata:
    name: str
    sourcetype: str
    authors: List[str]


@dataclass
class ResourceMetadata:
    title: str
    description: str
    url: str
    resourcetype: str
    source: SourceMetadata


@dataclass
class WebMetadata:
    lesson: Optional[LessonMetadata] = None
    resource: Optional[ResourceMetadata] = None
    error: Optional[str] = None

