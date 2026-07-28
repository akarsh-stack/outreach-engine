import serpapi
from config import settings
import logging

logger = logging.getLogger(__name__)

def search_company(company_name: str) -> str:
    """Searches SerpAPI for company information."""
    if not settings.SERPAPI_API_KEY:
        return ""
    try:
        client = serpapi.Client(api_key=settings.SERPAPI_API_KEY)
        results = client.search({
            "engine": "google",
            "q": company_name,
            "num": 3
        })
        
        snippets = []
        if "organic_results" in results:
            for result in results["organic_results"]:
                snippets.append(result.get("snippet", ""))
        
        return " ".join(snippets)
    except Exception as e:
        logger.error(f"Error searching SerpAPI for {company_name}: {e}")
        return ""
