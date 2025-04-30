from langchain.tools import tool
from bs4 import BeautifulSoup
from newspaper import Article
from playwright.async_api import async_playwright
import re, requests
from backend.llm.schemas.article import RawArticle



async def scrape_web_article1(url: str) -> dict:
    """
    Uses BeautifulSoup to scrape a webpage and extract its title, visible text, and metadata.
    Returns a RawArticle dictionary.
    """
    try:
        # Check if it's a Medium article by inspecting meta generator# Step 1: Directly fetch raw HTML
        raw_html = requests.get(url).text
        soup = BeautifulSoup(raw_html, "html.parser")
        site_name_tag = soup.find("meta", attrs={"property": "og:site_name"})
        site_name = site_name_tag.get("content") if site_name_tag else None
        site_type_tag = soup.find("meta", attrs={"property": "og:type"})
        site_type = site_type_tag.get("content") if site_type_tag else None


        # Step 2: Parse with newspaper
        article = Article(url)
        article.download()
        article.parse()

        return RawArticle(
            url=url,
            title=article.title,
            text=article.text,
            author=article.authors,
            publish_date=article.publish_date,
            html=article.html
        )
    
    except Exception as e:
        return {"error": str(e)}

#@tool
async def scrape_web_article2(url: str) -> dict:
    """
    Uses Playwright to scrape a webpage and extract its title, visible text, and metadata.
    Returns a RawArticle dictionary.
    """
    try:
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, timeout=60000)
        #await page.wait_for_load_state("networkidle")

        html = await page.content()
        title = await page.title()
        await browser.close()
        await playwright.stop()

        soup = BeautifulSoup(html, "html.parser")
        for tag in soup(["script", "style"]):
            tag.decompose()

        text = soup.get_text("\n")
        text = re.sub(r"\n+", "\n", text).strip()

        # Try to get author and published date
        author = None
        pub_date = None

        if meta_author := soup.find("meta", {"name": "author"}):
            author = meta_author.get("content")

        if meta_date := soup.find("meta", {"property": "article:published_time"}):
            pub_date = meta_date.get("content")

        return RawArticle(
            url=url,
            title=title,
            text=text,
            author=author,
            publish_date=pub_date,
            html=html
        ).__dict__

    except Exception as e:
        return {"error": str(e)}