import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import SessionLocal
from models.lead import Lead
from models.campaign import Campaign
from models.email import Email
from services.research import gather_lead_research
from services.ai_writer import generate_email
import logging

logger = logging.getLogger(__name__)

async def process_lead(lead_id: str):
    """Background task to research lead and generate initial email."""
    async with SessionLocal() as session:
        try:
            lead = await session.get(Lead, lead_id)
            if not lead:
                logger.error(f"Lead {lead_id} not found.")
                return

            campaign = await session.get(Campaign, lead.campaign_id)
            if not campaign:
                logger.error(f"Campaign {lead.campaign_id} not found.")
                return

            # 1. Gather Research
            logger.info(f"Gathering research for lead {lead.id}")
            research_data = await gather_lead_research(lead.company_name, lead.website)
            lead.research_data = research_data
            lead.status = "researched"
            await session.commit()

            # 2. Generate Email
            logger.info(f"Generating email for lead {lead.id}")
            lead_dict = {
                "first_name": lead.first_name,
                "last_name": lead.last_name,
                "company_name": lead.company_name
            }
            campaign_dict = {
                "product_description": campaign.product_description,
                "tone": campaign.tone
            }
            email_content = await generate_email(lead_dict, campaign_dict, research_data)
            
            new_email = Email(
                lead_id=lead.id,
                subject=email_content.get("subject", "Generated Subject"),
                body=email_content.get("body", "Generated Body"),
                status="draft",
                sequence_step=0
            )
            session.add(new_email)
            await session.commit()
            logger.info(f"Successfully processed lead {lead.id}")
        except Exception as e:
            logger.error(f"Error processing lead {lead_id}: {e}")
            await session.rollback()
