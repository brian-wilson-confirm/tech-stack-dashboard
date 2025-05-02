from langchain.tools import tool
from bs4 import BeautifulSoup
from newspaper import Article, ArticleException
import requests
from backend.llm.schemas.article import RawArticle
from nameparser import HumanName
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
    author_like_tags = soup.find_all(
        lambda tag: (
            tag.name in {"span", "div", "p", "a"} and (
                "author" in tag.get("class", []) or
                "byline" in tag.get("class", []) or
                re.search(r"(author|byline)", tag.get("id", "") or "", re.I)
            )
        )
    )

    for tag in author_like_tags:
        text = tag.get_text(strip=True)
        if text and is_real_fullname(text):  # <- strong filter
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
    
    # 7. Hugging Face or similar blog structures: look for class-based name tags
    hf_fullname_tags = soup.select('.fullname')
    for tag in hf_fullname_tags:
        text = tag.get_text(strip=True)
        if text and len(text.split()) <= 5:  # usually a real name
            authors.add(text)

    # 8. Also check for data-props if embedded as JSON (e.g., {"authors":[{"name":"..."}]})
    for script in soup.find_all("script"):
        if script.string and 'authors' in script.string:
            try:
                import json
                # Match potential embedded JSON
                matches = re.findall(r'{"authors":\[(.*?)\]}', script.string)
                for match in matches:
                    authors_json = json.loads(f'[{match}]')
                    for author in authors_json:
                        name = author.get("name")
                        if name:
                            authors.add(name)
            except Exception:
                continue
    
    # 9. Filter out non-real names
    authors = {name for name in authors if is_real_fullname(name)}

    # Final cleanup
    authors_cleaned = {
        re.sub(r"^by\s+", "", name.strip(), flags=re.I)
        for name in authors
        if len(name.strip()) > 2 and not re.search(r"\d{4}", name)
    }

    return sorted(authors_cleaned) if authors_cleaned else None


def is_valid_fullname(name: str) -> bool:
    words = name.strip().split()
    return (
        2 <= len(words) <= 4 and
        all(w[0].isupper() for w in words if w.isalpha()) and
        all(w.isalpha() for w in words)
    )

def is_probable_fullname(name: str) -> bool:
    parsed = HumanName(name)
    return bool(parsed.first and parsed.last)

def is_real_fullname(name: str) -> bool:
    return is_valid_fullname(name) and is_probable_fullname(name)