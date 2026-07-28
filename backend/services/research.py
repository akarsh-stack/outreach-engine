from services.scraper import scrape_website
from services.serp import search_company
import json

async def gather_lead_research(company_name: str, website: str = None) -> str:
    """Combines website scraping and SerpAPI search to gather research data."""
    research_data = {}
    
    if website:
        website_content = await scrape_website(website)
        if website_content:
            research_data["website_content"] = website_content
            
    search_results = search_company(company_name)
    if search_results:
        research_data["search_results"] = search_results
        
    return json.dumps(research_data)
