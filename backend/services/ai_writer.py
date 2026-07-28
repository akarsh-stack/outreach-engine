from openai import AsyncOpenAI
from config import settings
import json
import logging

logger = logging.getLogger(__name__)

async def generate_email(lead_data: dict, campaign_data: dict, research_data: str, sequence_step: int = 0) -> dict:
    """Generates an email subject and body using OpenAI."""
    if not settings.OPENAI_API_KEY:
        logger.warning("No OPENAI_API_KEY set. Returning placeholder email.")
        return {"subject": f"Follow up {sequence_step}", "body": "This is a mock email."}
        
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    prompt = f"""
    You are an expert sales development representative writing a cold outreach email.
    
    Lead Info:
    Name: {lead_data.get('first_name')} {lead_data.get('last_name')}
    Company: {lead_data.get('company_name')}
    
    Campaign Info:
    Product/Service Description: {campaign_data.get('product_description')}
    Tone: {campaign_data.get('tone')}
    
    Research Data:
    {research_data}
    
    Sequence Step: {sequence_step} (0 is initial email, >0 is follow-up)
    
    Write a highly personalized, concise email based on this information. 
    Output the result as a JSON object with 'subject' and 'body' keys.
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You output JSON strictly."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        return json.loads(result_text)
    except Exception as e:
        logger.error(f"Error generating email with OpenAI: {e}")
        return {"subject": "Error generating subject", "body": "Error generating body"}
