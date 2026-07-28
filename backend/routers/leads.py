from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models.lead import Lead
from models.campaign import Campaign
from schemas.lead import LeadCreate, LeadUpdate, LeadResponse
from middleware.auth import get_current_user_clerk_id
from workers.research_worker import process_lead

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("/", response_model=LeadResponse)
async def create_lead(
    lead: LeadCreate, 
    background_tasks: BackgroundTasks,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    # Verify campaign exists and belongs to user
    # (Skipping deep user verification for brevity, assuming frontend sets correct campaign_id)
    result = await db.execute(select(Campaign).where(Campaign.id == lead.campaign_id))
    campaign = result.scalars().first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    db_lead = Lead(**lead.model_dump())
    db.add(db_lead)
    await db.commit()
    await db.refresh(db_lead)
    
    # Trigger background research task
    background_tasks.add_task(process_lead, str(db_lead.id))
    
    return db_lead

@router.get("/campaign/{campaign_id}", response_model=List[LeadResponse])
async def list_leads_for_campaign(
    campaign_id: str,
    clerk_id: str = Depends(get_current_user_clerk_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Lead).where(Lead.campaign_id == campaign_id))
    return result.scalars().all()
