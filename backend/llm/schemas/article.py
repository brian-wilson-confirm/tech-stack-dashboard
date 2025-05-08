from dataclasses import dataclass
from typing import Optional

@dataclass
class RawArticle:
    """
    Represents the minimal structured content scraped from an article, blog, or general web page.
    This is the output format of tools like `web_scraper_tool` or `pdf_reader_tool`.
    """
    url: str                                # URL of the article
    title: str                              # Title of the article
    text: str                               # Text content of the article
    authors: Optional[str] = None           # e.g., "John Doe"
    favicon_url: Optional[str] = None       # URL of the favicon of the source 
    html: Optional[str] = None              # Original HTML content if needed for deeper analysis
    img_url: Optional[str] = None           # URL of the image in the article
    publish_date: Optional[str] = None      # ISO format ("2024-01-15") if detected
    resource_type: Optional[str] = None     # e.g., "Article", "PDF", "Video", "Post"
    source_name: Optional[str] = None       # e.g., "Medium", "Blogspot"
    source_type: Optional[str] = None       # e.g., "Blog", "Docs", "Course"
    source_url: Optional[str] = None        # URL of the source of the article
    summary: Optional[str] = None           # Summary of the article
    tags: Optional[str] = None              # e.g., "AI", "Machine Learning"
    error: Optional[str] = None             # Error message if the article is not found or cannot be scraped
