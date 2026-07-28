from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

async def scrape_website(url: str) -> str:
    """Scrapes website content using Playwright."""
    if not url.startswith("http"):
        url = "https://" + url

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            html = await page.content()
            await browser.close()
            
            soup = BeautifulSoup(html, "html.parser")
            for script in soup(["script", "style"]):
                script.extract()
            text = soup.get_text(separator=' ', strip=True)
            # Limit the size
            return text[:5000]
    except Exception as e:
        logger.error(f"Error scraping {url}: {e}")
        return ""
