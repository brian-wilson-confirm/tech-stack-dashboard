from newspaper import Article

def extract_article_metadata(url: str):
    article = Article(url)
    article.download()
    article.parse()

    #article.meta_keywords
    #article.meta_description
    #article.source_url
    #article.url
    #article.html
    #article.meta_favicon
    #article.text


    return {
        "authors": article.authors if article.authors else None,
        "title": article.title,
        "content": article.text,
        "top_image": article.top_image,
        "publish_date": article.publish_date,
        "summary": article.summary  # auto-generated
    }

