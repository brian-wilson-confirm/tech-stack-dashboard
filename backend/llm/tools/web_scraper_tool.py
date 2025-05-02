from langchain.tools import tool
from bs4 import BeautifulSoup
from newspaper import Article, ArticleException
import requests
from backend.llm.schemas.article import RawArticle
import re


async def scrape_web_article(url: str) -> dict:
    """
    Uses BeautifulSoup to scrape a webpage and extract its title, visible text, and metadata.
    Returns a RawArticle dictionary.
    """

    # Check if it's a Medium article by inspecting meta generator# Step 1: Directly fetch raw HTML
    raw_html = requests.get(url).text
    soup = BeautifulSoup(raw_html, "html.parser")
    site_name_tag = soup.find("meta", attrs={"property": "og:site_name"})
    source_name = site_name_tag.get("content") if site_name_tag else None
    site_type_tag = soup.find("meta", attrs={"property": "og:type"})
    resource_type = site_type_tag.get("content") if site_type_tag else None


    # Step 2: Parse with newspaper
    try:
        article = Article(url)
        article.download()
        article.parse()
    except ArticleException as e:
        return {"error": f"Failed to fetch article from URL: {str(e)}"}

    return RawArticle(
        url=url,
        title=article.title,
        text=article.text,
        authors=extract_authors(article),
        favicon_url=article.meta_favicon if article.meta_favicon else None,
        html=article.html if article.html else None,
        img_url=article.top_image if article.top_image else None,
        publish_date=article.publish_date if article.publish_date else None,
        resource_type=resource_type if resource_type else None,
        source_name=source_name if source_name else None,
        source_type=None,
        source_url=article.source_url if article.source_url else None,
        summary=article.summary if article.summary else None,
        tags=article.tags if article.tags else None
    )


def extract_authors(article: Article):
    authors = set()

    # 1. Built-in article.authors
    authors.update([a.strip() for a in article.authors if a.strip()])

    # 2. Parse full HTML
    soup = BeautifulSoup(article.html, "lxml")

    # 3. Check meta tags for common author formats
    meta_selectors = [
        {"name": "author"},
        {"property": "author"},
        {"name": "parsely-author"},
        {"name": "dc.creator"},
        {"name": "byl"},
        {"property": "article:author"},
    ]
    for attrs in meta_selectors:
        tag = soup.find("meta", attrs=attrs)
        if tag and tag.get("content"):
            authors.update([x.strip() for x in tag["content"].split(",") if x.strip()])

    # 4. Look for RDFa-style <span property="author"><span property="name">
    nested_author_tags = soup.select('[property="author"] [property="name"]')
    for tag in nested_author_tags:
        if tag.string and tag.string.strip():
            authors.add(tag.string.strip())

    # 5. Generic tags with author-related class or attribute
    candidates = soup.find_all(lambda tag: (
        tag.name in {"span", "div", "p", "a"} and any(
            re.search(r"(author|byline|name)", val, re.I)
            for attr, val in tag.attrs.items()
            if isinstance(val, str)
        )
    ))
    for tag in candidates:
        text = tag.get_text(strip=True)
        if text and 3 < len(text) < 100:
            text = re.sub(r"^by\s+", "", text, flags=re.I)
            if len(text.split()) <= 5:
                authors.add(text)

    # 6. Heuristic for "About the Authors" section (optional)
    about_section = soup.find(string=re.compile("About the Authors", re.I))
    if about_section:
        parent = about_section.find_parent()
        if parent:
            strongs = parent.find_all("strong")
            for s in strongs:
                name = s.get_text(strip=True)
                if name and len(name.split()) <= 5:
                    authors.add(name)

    # Final cleanup
    authors_cleaned = {
        re.sub(r"^by\s+", "", name.strip(), flags=re.I)
        for name in authors
        if len(name.strip()) > 2 and not re.search(r"\d{4}", name)
    }

    return sorted(authors_cleaned) if authors_cleaned else None