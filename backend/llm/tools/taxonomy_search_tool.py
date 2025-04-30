from langchain.tools import tool
import json

# Mock taxonomy structure. Replace this with actual DB queries or JSON loading in production.
TAXONOMY = {
    "Backend": ["API Framework", "Web Framework", "Authentication", "Database Drivers"],
    "Frontend": ["UI Components", "State Management", "React Ecosystem"],
    "DevOps": ["Containerization", "CI/CD", "Infrastructure as Code"],
    "Security": ["Authentication", "Authorization", "Secrets Management"],
    "Database": ["SQL", "NoSQL", "ORMs", "Indexing"],
    "AI/ML": ["Model Training", "Prompt Engineering", "NLP"],
    "Cloud Infrastructure": ["AWS", "Terraform", "Kubernetes"]
}

@tool
def taxonomy_search(query: str) -> str:
    """
    Searches the category-subcategory taxonomy for matches to the query string.
    Returns a list of matching categories and their subcategories.
    """
    query_lower = query.lower()
    matches = []

    for category, subcategories in TAXONOMY.items():
        if query_lower in category.lower() or any(query_lower in sub.lower() for sub in subcategories):
            matches.append({
                "category": category,
                "subcategories": subcategories
            })

    if matches:
        return json.dumps(matches, indent=2)
    else:
        return json.dumps({"message": "No matching categories or subcategories found."})
