from dataclasses import dataclass
from typing import Optional

@dataclass
class RawArticle:
    """
    Represents the minimal structured content scraped from an article, blog, or general web page.
    This is the output format of tools like `web_scraper_tool` or `pdf_reader_tool`.
    """
    url: str
    title: str
    text: str
    author: Optional[str] = None
    publish_date: Optional[str] = None  # ISO format ("2024-01-15") if detected
    source_name: Optional[str] = None  # e.g., "Medium", "Blogspot"
    source_type: Optional[str] = None  # e.g., "Blog", "Docs", "Course"
    resource_type: Optional[str] = None  # e.g., "Article", "PDF", "Video", "Post"
    html: Optional[str] = None  # Original HTML content if needed for deeper analysis