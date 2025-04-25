from newspaper import Article

def extract_article_metadata(url: str):
    article = Article(url)
    article.download()
    article.parse()

    return {
        "title": article.title,
        "author": article.authors[0] if article.authors else None,
        "content": article.text,
        "top_image": article.top_image,
        "publish_date": article.publish_date,
        "summary": article.summary  # auto-generated
    }
