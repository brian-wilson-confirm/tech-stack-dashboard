import requests
from newspaper import Article
from bs4 import BeautifulSoup


def extract_article_metadata(url: str):

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

    #article.html
    #article.meta_favicon

    return {
        "title": "PLACEHOLDER",
        "authors": article.authors if article.authors else None,
        "sourcetype": "Author" if article.authors else "Publisher",
        "source": site_name,
        "resourcetype": site_type,
        "resourcetitle": article.title,
        "resourcedescription": article.meta_description,
        "resourceurl": article.url,
        "lessonlevel": "unknown",
        "lessontitle": article.title,
        "lessondescription": article.meta_description,
        "lessontags": article.meta_keywords,
        "content": article.text,
        "top_image": article.top_image,
        "publish_date": article.publish_date,
        "summary": article.summary  # auto-generated
    }

